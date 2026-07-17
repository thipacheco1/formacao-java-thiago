import React from 'react';

export default function GuidedLessonFacts({ items, ariaLabel = 'Resumo da aula' }) {
  return <div className="guided-lesson-facts" aria-label={ariaLabel}>
    {items.map((item, index) => <React.Fragment key={`${item.value}-${item.label}`}>
      {index > 0 && <i aria-hidden="true" />}
      <span><strong>{item.value}</strong> {item.label}</span>
    </React.Fragment>)}
  </div>;
}
