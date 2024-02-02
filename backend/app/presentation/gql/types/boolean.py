import strawberry


@strawberry.type
class MyBoolean:
    result: bool


class BooleanType:
    """GraphQLのエンドポイント呼び出し時にBool値のみを返却するためのクラス"""

    def __init__(self, result: bool):
        self.result = result
