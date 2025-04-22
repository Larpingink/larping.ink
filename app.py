from flask import Flask, request, redirect, render_template_string, session, url_for
import sqlite3
from uuid import uuid4
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'
DB = 'site.db'

def init_db():
    with sqlite3.connect(DB) as conn:
        conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS pastes (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            title TEXT,
            content TEXT,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        ''')

@app.route('/')
def home():
    return redirect('/upload')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'user_id' not in session:
        return redirect('/login')
    if request.method == 'POST':
        paste_id = str(uuid4())[:8]
        title = request.form['title']
        content = request.form['content']
        created_at = datetime.utcnow().isoformat()
        with sqlite3.connect(DB) as conn:
            conn.execute("INSERT INTO pastes (id, user_id, title, content, created_at) VALUES (?, ?, ?, ?, ?)",
                         (paste_id, session['user_id'], title, content, created_at))
        return redirect(f'/view/{paste_id}')
    return render_template_string(open("index.html").read())

@app.route('/view/<paste_id>')
def view_paste(paste_id):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT title, content FROM pastes WHERE id=?", (paste_id,))
        result = cursor.fetchone()
        if result:
            return f"<h2>{result[0]}</h2><pre>{result[1]}</pre>"
    return "Paste not found", 404

@app.route('/recent')
def recent():
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, created_at FROM pastes ORDER BY created_at DESC LIMIT 10")
        pastes = cursor.fetchall()
    output = "<h1>Recent Pastes</h1><ul>"
    for p in pastes:
        output += f"<li><a href='/view/{p[0]}'>{p[1]}</a> - {p[2]}</li>"
    output += "</ul>"
    return output

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form['username']
        pw = request.form['password']
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE username=? AND password=?", (user, pw))
            result = cursor.fetchone()
            if result:
                session['user_id'] = result[0]
                return redirect('/upload')
        return "Invalid login"
    return render_template_string(open("index.html").read())

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user = request.form['username']
        pw = request.form['password']
        with sqlite3.connect(DB) as conn:
            try:
                conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user, pw))
            except sqlite3.IntegrityError:
                return "Username already taken"
        return redirect('/login')
    return render_template_string(open("index.html").read())

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
