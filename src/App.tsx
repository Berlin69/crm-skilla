import './App.css'
import {Container} from "@/components/ui/container.tsx";
import {Filter} from "@/components/shared/filter.tsx";
import {MainTable} from "@/features/calls/main-table.tsx";

function App() {

  return (
    <main className={'bg-plt-background min-h-screen pt-20'}>
      <Container>
        <Filter/>
        <MainTable/>
      </Container>
    </main>
  )
}

export default App