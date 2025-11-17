// In your fetchResults function:
const fetchResults = async () => {
  try {
    setLoading(true);
    setError('');
    const response = await fetch('/api/results');
    const data = await response.json();
    
    if (response.ok) {
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError('No results available from source websites');
      }
    } else {
      setError(data.error || 'Failed to fetch real results');
    }
  } catch (err) {
    setError('Network error: Please check your internet connection');
  } finally {
    setLoading(false);
  }
};
