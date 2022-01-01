from run import db, ma
from passlib.hash import pbkdf2_sha256 as sha256
from sqlalchemy import JSON

class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)
    todos = db.relationship('TodoModel', backref='user', lazy=True)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blocklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)

class TodoModel(db.Model):
    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(120), nullable = False)
    created_at = db.Column(db.String(120), nullable = False)
    due_date = db.Column(db.String(120))
    color = db.Column(db.String(120))
    description = db.Column(db.String(420))
    done = db.Column(db.Boolean(), default=False, nullable=False)
    # steps = db.Column(db.Text())
    steps = db.Column(JSON, default=list,nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def patch_to_db():
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class TodoModelSchema(ma.Schema):
    class Meta:
        fields = ("id", "title", "created_at", "due_date", "color", "description", "done", "steps")
        model = TodoModel

todo_model_schema = TodoModelSchema()
todo_models_schema = TodoModelSchema(many=True)