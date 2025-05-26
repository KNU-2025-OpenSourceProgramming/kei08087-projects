const { useState, useEffect } = React;

function VideoCard({ video }) {
  return (
    <div className="col-md-4">
      <div className="card video-card">
        <img 
          src={video.thumbnailUrl} 
          className="card-img-top thumbnail" 
          alt={video.title}
        />
        <div className="card-body">
          <h5 className="card-title">{video.title}</h5>
          <p className="card-text text-muted">{video.channelTitle}</p>
          <p className="card-text small">{video.description.substring(0, 100)}...</p>
          <a 
            href={`https://www.youtube.com/watch?v=${video.id}`} 
            className="btn btn-danger" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-play-fill"></i> 동영상 보기
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchVideos = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&max_results=12`);
      const data = await response.json();
      
      if (response.ok) {
        setVideos(data.videos);
      } else {
        setError(data.error || '검색 중 오류가 발생했습니다.');
        setVideos([]);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-center mb-4">YouTube 동영상 검색</h1>
          
          <form onSubmit={searchVideos}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="검색어를 입력하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                검색
              </button>
            </div>
          </form>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            !loading && !error && query && (
              <p className="text-center">검색 결과가 없습니다.</p>
            )
          )}
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);