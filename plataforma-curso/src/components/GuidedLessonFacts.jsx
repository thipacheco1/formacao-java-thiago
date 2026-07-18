import React, { useEffect, useRef } from 'react';

export default function GuidedLessonFacts({ items, ariaLabel = 'Resumo da aula' }) {
  const factsRef = useRef(null);

  useEffect(() => {
    const lesson = factsRef.current?.closest('.guided-git-lesson');
    const stepNav = lesson?.querySelector('.guided-step-nav');
    if (!stepNav) return undefined;

    let frameId;
    let initialPass = true;
    const focusActiveStep = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        if (!window.matchMedia('(max-width: 920px)').matches) return;
        const activeButton = stepNav.querySelector('button.active');
        if (!activeButton) return;
        if (initialPass && activeButton === stepNav.querySelector('button')) {
          initialPass = false;
          return;
        }
        initialPass = false;
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });
    };

    const observer = new MutationObserver(focusActiveStep);
    observer.observe(stepNav, { attributes: true, attributeFilter: ['class'], subtree: true });
    window.addEventListener('resize', focusActiveStep);
    focusActiveStep();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', focusActiveStep);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <div ref={factsRef} className="guided-lesson-facts" aria-label={ariaLabel}>
    {items.map((item, index) => <React.Fragment key={`${item.value}-${item.label}`}>
      {index > 0 && <i aria-hidden="true" />}
      <span><strong>{item.value}</strong> {item.label}</span>
    </React.Fragment>)}
  </div>;
}
