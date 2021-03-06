from flask_restful import Resource, reqparse
from models import UserModel, TodoModel, todo_model_schema, todo_models_schema, RevokedTokenModel
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt)

parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)

# get todo args
get_todo_parser = reqparse.RequestParser()
get_todo_parser.add_argument('title', type = str, help = 'This field cannot be blank', required = True, location = 'json')
get_todo_parser.add_argument('done', type = bool, help = 'This field cannot be blank', required = True, location = 'json')
get_todo_parser.add_argument('created_at', type = str, help = 'This field cannot be blank', required = True, location = 'json')
get_todo_parser.add_argument('due_date', type = str, location = 'json')
get_todo_parser.add_argument('color', type = str, location = 'json')
get_todo_parser.add_argument('description', type = str, location = 'json')
get_todo_parser.add_argument('steps',  type=list, location="json")

# update todo args
update_todo_parser = reqparse.RequestParser()
update_todo_parser.add_argument('title', type = str, location = 'json')
update_todo_parser.add_argument('done', type = bool, location = 'json')
update_todo_parser.add_argument('due_date', type = str, location = 'json')
update_todo_parser.add_argument('color', type = str, location = 'json')
update_todo_parser.add_argument('description', type = str, location = 'json')
update_todo_parser.add_argument('steps',  type=list, location="json")


class UserRegistration(Resource):
    def post(self):
        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {'message': 'User {} already exists'.format(data['username'])}, 409

        new_user = UserModel(
            username = data['username'],
            password = UserModel.generate_hash(data['password'])
        )

        try:
            new_user.save_to_db()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created'.format(data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = UserModel.find_by_username(data['username'])

        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}

        if UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}


class UserLogoutAccess(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500

class UserTodos(Resource):
    @jwt_required()
    def get(self):
        current_user_name = get_jwt_identity()
        current_usr_id = UserModel.find_by_username(current_user_name).id
        todos = TodoModel.query.filter_by(user_id=current_usr_id).all()
        return todo_models_schema.dump(todos)


    @jwt_required()
    def post(self):
        current_user_name = get_jwt_identity()
        current_usr_id = UserModel.find_by_username(current_user_name).id

        data = get_todo_parser.parse_args()

        new_todo = TodoModel(
            title = data['title'],
            created_at = data['created_at'],
            due_date = data['due_date'],
            color = data['color'],
            description = data['description'],
            done = data['done'],
            steps = data['steps'],
            user_id = current_usr_id
        )

        try:
            new_todo.save_to_db()
            return todo_model_schema.dump(new_todo)
        except:
            return {'message': 'Something went wrong'}, 500


    @jwt_required()
    def patch(self, todo_id):
        current_user_name = get_jwt_identity()
        current_usr_id = UserModel.find_by_username(current_user_name).id

        todo = TodoModel.query.filter_by(user_id=current_usr_id, id=todo_id).first_or_404()
        data = update_todo_parser.parse_args()

        if data['title']:
            todo.title = data['title']

        if data['due_date']:
            todo.due_date = data['due_date']

        if data['color']:
            todo.color = data['color']

        if data['description']:
            todo.description = data['description']

        if data['done']:
            todo.done = data['done']

        if data['steps']:
            todo.steps = data['steps']

        todo.user_id = current_usr_id

        try:
            TodoModel.patch_to_db()
            return todo_model_schema.dump(todo)
        except:
            return {'message': 'Something went wrong'}, 500


    @jwt_required()
    def delete(self, todo_id):
        current_user_name = get_jwt_identity()
        current_usr_id = UserModel.find_by_username(current_user_name).id

        todo = TodoModel.query.filter_by(user_id=current_usr_id, id=todo_id).first_or_404()
        todo.delete_from_db()
        return '', 204
