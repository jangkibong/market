from fastapi import FastAPI, UploadFile, Form, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

# SQLite 데이터베이스 연결 설정
con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

# 테이블 생성: items 테이블이 없을 경우에만 생성
cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items(
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                image BLOB,
                price INTEGER NOT NULL,
                description TEXT,
                place TEXT NOT NULL,
                insertAt INTEGER NOT NULL
            );
            """)

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI()

# 모든 아이템 조회 API
@app.get('/items')
async def get_items():
    # 행의 컬럼명도 함께 가져오기 위해 row_factory 설정
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    # items 테이블의 모든 데이터 조회
    rows = cur.execute(f"""
                        SELECT * FROM items;
                        """).fetchall()
    
    # JSON 형식으로 응답 반환
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))

# 특정 아이템의 이미지 조회 API
@app.get("/images/{item_id}")
async def get_image(item_id):
    cur = con.cursor()
    # 아이템 ID에 해당하는 이미지 바이트 조회
    image_bytes = cur.execute(f"""
                                SELECT image from items WHERE id={item_id}
                                """).fetchone()[0]
    
    # 이미지 바이트를 응답으로 반환
    return Response(content=bytes.fromhex(image_bytes), media_type="image/*")

# 새로운 아이템 생성 API
@app.post("/items")
async def create_item(
    image: UploadFile,  # 업로드된 이미지 파일
    title: Annotated[str, Form()],  # 아이템 제목
    price: Annotated[int, Form()],  # 아이템 가격
    description: Annotated[str, Form()],  # 아이템 설명
    place: Annotated[str, Form()],  # 아이템 위치
    insertAt: Annotated[int, Form()]  # 삽입 시각
):
    print(image, title, price, description, place)
    
    # 이미지 파일을 바이트로 읽음
    imag_bytes = await image.read()
    # 아이템 정보를 데이터베이스에 삽입
    cur.execute(f"""
                INSERT INTO items (title, image, price, description, place, insertAt)
                VALUES ('{title}', '{imag_bytes.hex()}', {price}, '{description}', '{place}', {insertAt})
                """)
    con.commit()  # 변경 사항 커밋
    return '200'  # 성공 응답

# 사용자 가입 API
@app.post('/signup')
def signup(
    id: Annotated[str, Form()],  # 사용자 ID
    pw: Annotated[str, Form()],  # 사용자 비밀번호
    name: Annotated[str, Form()], # 사용자 이름
    email: Annotated[str, Form()] # 사용자 이메일
):
    
    cur.execute(f"""
                INSERT INTO users(id, pw, name, email)
                Values ("{id}","{pw}","{name}","{email}")
                """)
    con.commit()
    return 200  # 성공 응답

# 정적 파일(프론트엔드) 서빙
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
