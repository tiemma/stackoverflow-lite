from app.models import Model


class User(Model):
    def __init__(self) -> None:
        super().__init__()

    def select_all(self, table: str):
        return super().select_all("users")

