from flask import Flask, request, jsonify
import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Config Cloudinary
cloudinary.config(
    cloud_name="dbjtntvvz",
    api_key="586963928814799",
    api_secret="KsFTGd0CRCAulN36bwDL0lUq3lU"
)

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload():
    if 'arquivo' not in request.files:
        return jsonify({'erro': 'Nenhum arquivo enviado'}), 400
    arquivo = request.files['arquivo']
    if arquivo.filename == '':
        return jsonify({'erro': 'Arquivo inválido'}), 400
    try:
        resultado = cloudinary.uploader.upload(arquivo)
        url = resultado.get('secure_url')
        return jsonify({'url': url}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Listar imagens
@app.route('/imagens', methods=['GET'])
def listar_imagens():
    try:
        recursos = cloudinary.api.resources(type="upload", resource_type="image", max_results=30)
        imagens = [{'url': r['secure_url'], 'public_id': r['public_id']} for r in recursos.get('resources', [])]
        return jsonify(imagens)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Excluir imagem
@app.route('/excluir', methods=['POST'])
def excluir():
    data = request.get_json()
    public_id = data.get('public_id')
    if not public_id:
        return jsonify({'erro': 'public_id é obrigatório'}), 400
    try:
        resultado = cloudinary.uploader.destroy(public_id)
        return jsonify({'mensagem': 'Imagem excluída com sucesso'}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
