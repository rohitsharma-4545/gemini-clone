import React from 'react';

const Help = () => (
  <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded shadow mt-8">
    <h2 className="text-xl font-bold mb-4 text-orange-900 dark:text-white">Help & FAQ</h2>
    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
      <li className="mb-2"><b>How do I start a new chat?</b> Click the <b>New Chat</b> button in the sidebar.</li>
      <li className="mb-2"><b>How do I upload an image?</b> Click the gallery icon in the chat input area.</li>
      <li className="mb-2"><b>How do I switch between dark and light mode?</b> Use the settings menu in the sidebar.</li>
      <li className="mb-2"><b>How do I delete a chatroom?</b> Click the × icon next to a chatroom in the sidebar.</li>
      <li className="mb-2"><b>Is my data saved?</b> Yes, your chats and settings are saved in your browser.</li>
    </ul>
  </div>
);

export default Help; 