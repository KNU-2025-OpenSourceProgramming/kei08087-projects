from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import googleapiclient.discovery
import os

app = Flask(__name__, template_folder='./www', static_folder='./www', static_url_path='/')
CORS(app)

# YouTube API 키 설정
API_KEY = "AIzaSyD2h-Vt0LCQ_WO4bhxdPZGm7XGBu2_aW0Q"  # 발급받은 API 키로 변경하세요

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def search_videos():
    query = request.args.get('query', '')
    max_results = request.args.get('max_results', 10, type=int)
    
    if not query:
        return jsonify({"error": "검색어를 입력해주세요."}), 400
    
    youtube = googleapiclient.discovery.build(
        "youtube", "v3", developerKey=API_KEY
    )
    
    try:
        search_response = youtube.search().list(
            q=query,
            part="snippet",
            maxResults=max_results,
            type="video"
        ).execute()
        
        videos = []
        for item in search_response.get("items", []):
            video_data = {
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "thumbnailUrl": item["snippet"]["thumbnails"]["medium"]["url"],
                "channelTitle": item["snippet"]["channelTitle"],
                "publishedAt": item["snippet"]["publishedAt"]
            }
            videos.append(video_data)
            
        return jsonify({"videos": videos})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
