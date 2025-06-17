import React from 'react';

export default function Card({ titulo }) {

  return (
    <article
        className="rounded-[10px] border border-gray-200 bg-white px-4 pt-12 pb-4 dark:border-gray-700 dark:bg-gray-900"
        >
        <time datetime="2022-10-10" className="block text-xs text-gray-500 dark:text-gray-400">
        10th Oct 2022
        </time>

        <a href="#">
            <h3 className="mt-0.5 text-lg font-medium text-gray-900 dark:text-white">
                {titulo}
            </h3>
        </a>

        <div className="mt-4 flex flex-wrap gap-1">
            <span
                className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600 dark:bg-purple-600 dark:text-purple-100"
            >
                Snippet
            </span>

            <span
                className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600 dark:bg-purple-600 dark:text-purple-100"
            >
                JavaScript
            </span>
        </div>
    </article>
    //     isPressed ? 'border-blue-500' : 'border-gray-300'
    // <div
    //   className={`border-2 rounded-2xl p-4 shadow-md transition-colors duration-200 select-none ${
    //     isPressed ? 'border-blue-500' : 'border-gray-300'
    //   }`}
    //   onMouseDown={() => setIsPressed(true)}
    //   onMouseUp={() => setIsPressed(false)}
    //   onMouseLeave={() => setIsPressed(false)}
    // >
    //   <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
    // </div>
  );
}
