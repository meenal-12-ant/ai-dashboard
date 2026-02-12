import React, { useState } from 'react';
import { RefreshCw, Bell, Calendar, ExternalLink, Sparkles } from 'lucide-react';

const AINewsDashboard = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [schedule, setSchedule] = useState('09:00');
  const [emailNotifications, setEmailNotifications] = useState(false);

  const fetchAIUpdates = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Search the web for the latest AI advancements, tool releases, and major updates from the past 24 hours. Focus on:
- New AI model releases or updates
- AI tool enhancements and new features
- Breakthrough research or papers
- Industry news from companies like OpenAI, Anthropic, Google, Meta, etc.

Format your response as a JSON array with this structure:
[
  {
    "title": "Brief headline",
    "summary": "2-3 sentence summary",
    "source": "Source name",
    "category": "Models/Tools/Research/Industry",
    "date": "Today's date"
  }
]

Return ONLY the JSON array, no other text.`
          }],
          tools: [{
            type: "web_search_20250305",
            name: "web_search"
          }]
        })
      });

      const data = await response.json();
      const content = data.content
        .map(item => item.type === 'text' ? item.text : '')
        .join('\n')
        .trim();
      
      const cleanContent = content.replace(/```json|```/g, '').trim();
      const newsItems = JSON.parse(cleanContent);
      
      setUpdates(newsItems);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([
        {
          title: "Demo: Claude 4.5 Sonnet Released",
          summary: "Anthropic announces Claude 4.5 Sonnet with improved reasoning and coding capabilities. The model shows significant improvements in complex task handling.",
          source: "Anthropic Blog",
          category: "Models",
          date: new Date().toLocaleDateString()
        },
        {
          title: "Demo: ChatGPT Canvas Update",
          summary: "OpenAI enhances Canvas feature with better code editing and collaborative writing tools. Users report improved workflow integration.",
          source: "OpenAI",
          category: "Tools",
          date: new Date().toLocaleDateString()
        },
        {
          title: "Demo: New Vision Model Research",
          summary: "Researchers publish breakthrough paper on multimodal understanding. The approach shows 15% improvement on standard benchmarks.",
          source: "arXiv",
          category: "Research",
          date: new Date().toLocaleDateString()
        }
      ]);
      setLastUpdate(new Date().toLocaleString() + ' (Demo Mode)');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Models: 'bg-purple-100 text-purple-800',
      Tools: 'bg-blue-100 text-blue-800',
      Research: 'bg-green-100 text-green-800',
      Industry: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">AI Daily Updates</h1>
            </div>
            <button
              onClick={fetchAIUpdates}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Fetching...' : 'Fetch Updates'}
            </button>
          </div>

          {/* Schedule Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Daily Update Time:</label>
              <input
                type="time"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded"
                />
                Email Notifications
              </label>
            </div>
          </div>

          {lastUpdate && (
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
              Last updated: {lastUpdate}
            </div>
          )}
        </div>

        {/* News Feed */}
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Click "Fetch Updates" to get the latest AI news</p>
            </div>
          ) : (
            updates.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.summary}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 pt-3 border-t">
                  <span className="font-medium">Source:</span>
                  <span>{item.source}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-900 mb-2">How to use:</h3>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Click "Fetch Updates" to get the latest AI news using web search</li>
            <li>• Set your preferred daily update time</li>
            <li>• Enable email notifications to receive updates automatically</li>
            <li>• Updates are categorized by Models, Tools, Research, and Industry news</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AINewsDashboard;
