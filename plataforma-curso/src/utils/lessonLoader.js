export async function loadLessons() {
  // Use Vite's import.meta.glob to dynamically load all markdown files
  // '?raw' ensures we get the raw string content
  const mdModules = import.meta.glob('../../../docs/aulas/*.md', { query: '?raw', import: 'default' });
  
  // Load MP3 files to get their URLs
  const audioModules = import.meta.glob('../../../docs/aulas/*.mp3', { query: '?url', import: 'default' });
  
  const lessons = [];
  
  for (const path in mdModules) {
    // Extract filename from the path
    const filename = path.split('/').pop();
    const title = filename.replace('.md', '');
    
    // Check if there is an audio file with the same name
    const audioPath = path.replace('.md', '.mp3');
    let audioUrlPromise = null;
    if (audioModules[audioPath]) {
      audioUrlPromise = audioModules[audioPath]();
    }
    
    lessons.push({
      id: filename,
      path,
      title,
      loadContent: mdModules[path], // This is a function returning a promise with the raw string
      loadAudio: audioUrlPromise ? () => audioUrlPromise : null
    });
  }
  
  // Sort lessons alphabetically (which sorts them by prefix number)
  lessons.sort((a, b) => a.title.localeCompare(b.title));
  
  return lessons;
}
