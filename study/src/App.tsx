import StudyPage from './components/StudyPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Harness Study
          </h1>
          <p className="text-sm text-gray-500">하네스 엔지니어링 4기둥 학습</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <StudyPage />
      </main>
    </div>
  );
}

export default App;
