###Api Rest con flask básica con mi nombre y canción favorita
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/')
def index():
    ##retoonrar mi nombre y canción favorita
    return jsonify({
        'Nombre': 'Fernando José Vicente Velásquez',
        'Album Fav': 'Rush!- Maneskin'
    })

if __name__ == '__main__':
    app.run(debug=True)
# Para ejecutar la API, guarda este código en un archivo llamado api.py y ejecuta el comando:
# python api.py