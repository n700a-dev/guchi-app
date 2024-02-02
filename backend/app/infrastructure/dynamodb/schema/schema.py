# テーブル設計
# https://qiita.com/estaro/items/b329deafdfef790aa355#gsi

# GSIとLSI
# https://dynobase.dev/dynamodb-indexes/


def create_schema(dynamodb):
    """
    dynamodbのテーブル構成を定義

    Args:
        dynamodb (obj): dynamodbのインスタンス

    Returns:
        List(function): 各テーブルの作成関数を格納したリスト
    """

    def create_users():
        """usersテーブルを作成する"""
        users_table = dynamodb.create_table(
            TableName="users",
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "N"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 3, "WriteCapacityUnits": 3},
        )

        users_table.wait_until_exists()
        print(users_table.item_count)

    def create_posts():
        """postsテーブルを作成する"""
        posts_table = dynamodb.create_table(
            TableName="posts",
            KeySchema=[
                {"AttributeName": "authorId", "KeyType": "HASH"},
                {"AttributeName": "uploadedAtMs", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "authorId", "AttributeType": "N"},  # FK
                {"AttributeName": "uploadedAtMs", "AttributeType": "N"},
                {"AttributeName": "createdAt", "AttributeType": "S"},  # for LSI
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 3, "WriteCapacityUnits": 3},
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "postCreatedAtGSIndex",
                    "KeySchema": [
                        {"AttributeName": "authorId", "KeyType": "HASH"},
                        {"AttributeName": "createdAt", "KeyType": "RANGE"},
                    ],
                    "Projection": {
                        "ProjectionType": "ALL",
                    },
                    "ProvisionedThroughput": {"ReadCapacityUnits": 3, "WriteCapacityUnits": 3},
                },
            ],
        )

        posts_table.wait_until_exists()

    def create_posted_dates():
        """posted_datesテーブルを作成する"""
        posted_dates = dynamodb.create_table(
            TableName="postedDates",
            KeySchema=[
                {"AttributeName": "authorId", "KeyType": "HASH"},
                {"AttributeName": "postedDate", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "authorId", "AttributeType": "N"},
                {"AttributeName": "postedDate", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 3, "WriteCapacityUnits": 3},
        )

    return [create_users, create_posts, create_posted_dates]
