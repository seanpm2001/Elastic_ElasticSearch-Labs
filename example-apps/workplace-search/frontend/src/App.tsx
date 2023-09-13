import React, { useState } from 'react'

import {
  actions,
  AppStatus,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'store/provider'
import { Header } from 'components/header'
import { Loader } from 'components/loader'
import { Chat } from 'components/chat/chat'
import SearchInput from 'components/search_input'
import { ReactComponent as ChatIcon } from 'images/chat_icon.svg'
import { SearchResults } from './components/search_results'

const App = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.status)
  const sources = useAppSelector((state) => state.sources)
  const [summary, ...messages] = useAppSelector((state) => state.conversation)
  const hasSummary = useAppSelector(
    (state) => !!state.conversation?.[0]?.content
  )
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (query: string) => {
    dispatch(thunkActions.search(query))
  }
  const handleSendChatMessage = (query: string) => {
    dispatch(thunkActions.askQuestion(query))
  }
  const handleAbortRequest = () => {
    dispatch(thunkActions.abortRequest())
  }
  const handleToggleSource = (name) => {
    dispatch(actions.sourceToggle({ name }))
  }
  const handleSourceClick = (name) => {
    dispatch(actions.sourceToggle({ name, expanded: true }))

    setTimeout(() => {
      document
        .querySelector(`[data-source="${name}"]`)
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const suggestedQueries = [
    'What type of query does elastic have?',
    'How do I setup a dense vector field?\n',
    'Does ELSER has some limitations?',
    'What job openings do we have?',
    'How does compensation work?',
  ]

  return (
    <>
      <Header />

      <div className="p-4 max-w-2xl mx-auto">
        <SearchInput
          onSearch={handleSearch}
          value={searchQuery}
          appStatus={status}
        />

        {status === AppStatus.Idle ? (
          <div className="mx-auto my-6">
            <h2 className="text-zinc-400 text-sm font-medium mb-3  inline-flex items-center gap-2">
              <ChatIcon /> Common questions
            </h2>
            <div className="flex flex-col space-y-4">
              {suggestedQueries.map((query) => (
                <button
                  key={query}
                  className="hover:-translate-y-1 hover:shadow-lg hover:bg-zinc-300 transition-transform h-12 px-4 py-2 bg-zinc-200 rounded-md shadow flex items-center text-zinc-700"
                  onClick={(e) => {
                    e.preventDefault()
                    setSearchQuery(query)
                    handleSearch(query)
                  }}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {hasSummary ? (
              <div className="max-w-2xl mx-auto relative">
                <Chat
                  status={status}
                  messages={messages}
                  summary={summary}
                  onSend={handleSendChatMessage}
                  onAbortRequest={handleAbortRequest}
                  onSourceClick={handleSourceClick}
                />

                <SearchResults
                  results={sources}
                  toggleSource={handleToggleSource}
                />
              </div>
            ) : (
              <Loader className="relative w-24 mx-auto py-10 opacity-30" />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default App
