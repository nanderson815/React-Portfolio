import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTripleTap } from '../hooks/useTripleTap';
import { captureWords } from '../game/captureWords';
import { startWordJump } from '../game/wordJump';

// Below this there is not enough text on screen to make a course out of.
const MIN_WORDS = 24;

function ProjectDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const articleRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    fetch(`/content/projects/${slug}.md`)
      .then(response => {
        // A missing .md is caught by the catch-all rewrite and comes back as
        // index.html with a 200, so the content type is what identifies it.
        const type = response.headers.get('content-type') || '';
        if (!response.ok || type.includes('text/html')) {
          throw new Error('Project not found');
        }
        return response.text();
      })
      .then(markdown => {
        setContent(markdown);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const start = useCallback(() => {
    if (playing || loading || error || !articleRef.current) return;
    const words = captureWords(articleRef.current);
    if (words.length < MIN_WORDS) return;

    // The third click is also the browser's select-a-paragraph gesture, so
    // drop the highlight it leaves behind before the article disappears.
    const selection = document.getSelection();
    if (selection && selection.removeAllRanges) selection.removeAllRanges();

    setPlaying(true);
    gameRef.current = startWordJump(words, {
      onExit: () => {
        gameRef.current = null;
        setPlaying(false);
      },
    });
  }, [playing, loading, error]);

  useTripleTap(start);

  // Leaving the page mid-climb should not strand the canvas or the scroll lock.
  useEffect(() => () => {
    if (gameRef.current) gameRef.current.stop();
  }, []);

  return (
    <div className="container container--content">
      <main className="main main--content">
        {loading ? (
          <p className="coming-soon">loading<span className="cursor">_</span></p>
        ) : error ? (
          <>
            <h1 className="page-title">404</h1>
            <p className="coming-soon">project not found<span className="cursor">_</span></p>
          </>
        ) : (
          <div
            className="project-detail"
            ref={articleRef}
            style={playing ? { visibility: 'hidden' } : null}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </main>
      <footer className="footer" style={playing ? { visibility: 'hidden' } : null}>
        <Link to="/projects" className="link">← back to projects</Link>
      </footer>
    </div>
  );
}

export default ProjectDetail;
