from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import cloudinary.api

app = Flask(__name__)
CORS(app)  # Permite requisições de outros domínios (como seu frontend)

# Configure aqui com os dados da sua conta Cloudinary
cloudinary.config(
    cloud_name='dbjtntvvz',
    api_key='586963928814799',
    api_secret='KsFTGd0CRCAulN36bwDL0lUq3lU'
)

# Upload de imagem
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'arquivo' not in request.files:
        return jsonify({'erro': 'Nenhum arquivo encontrado'}), 400

    arquivo = request.files['arquivo']
    if arquivo.filename == '':
        return jsonify({'erro': 'Nome de arquivo inválido'}), 400

    try:
        resultado = cloudinary.uploader.upload(arquivo)
        return jsonify({
            'mensagem': 'Imagem enviada com sucesso',
            'url': resultado.get('secure_url'),
            'public_id': resultado.get('public_id')
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Listar imagens
@app.route('/imagens', methods=['GET'])
def listar_imagens():
    try:
        recursos = cloudinary.api.resources(type="upload", resource_type="image", max_results=50)
        imagens = [{
            'url': r['secure_url'],
            'public_id': r['public_id']
        } for r in recursos.get('resources', [])]
        return jsonify(imagens)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Excluir imagem
@app.route('/excluir', methods=['POST'])
def excluir_imagem():
    data = request.get_json()
    public_id = data.get('public_id')
    if not public_id:
        return jsonify({'erro': 'public_id é obrigatório'}), 400
    try:
        cloudinary.uploader.destroy(public_id)
        return jsonify({'mensagem': 'Imagem excluída com sucesso'}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
