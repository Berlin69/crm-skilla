import './App.css'
import {Container} from "@/components/ui/container.tsx";
import {Filter} from "@/components/shared/filter.tsx";

function App() {

  return (
    <main className={'bg-plt-background min-h-screen'}>
      <Container>
        <Filter/>
        <p className={'text-red-500'}>
          hello vite
        </p>
      </Container>
    </main>
  )
}

export default App