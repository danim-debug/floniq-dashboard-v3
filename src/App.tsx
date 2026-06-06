import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "@/components/app-shell"
import { Dashboard } from "@/components/dashboard"

function App() {
  return (
    <TooltipProvider>
      <AppShell>
        <Dashboard />
      </AppShell>
    </TooltipProvider>
  )
}

export default App
