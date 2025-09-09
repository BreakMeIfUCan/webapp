import { notFound } from "next/navigation"
import { getTestById } from "@/data-access/tests"
import TestComparisonClient from "./test-comparison-client"

interface TestComparisonPageProps {
  params: Promise<{ id: string }>
}

export default async function TestComparisonPage({ params }: TestComparisonPageProps) {
  const { id } = await params
  
  // Fetch the test (contains both attack and defense results)
  const test = await getTestById(id)

  if (!test) {
    notFound()
  }

  // Convert string decimals to numbers and handle null values
  const convertedTest = {
    ...test,
    id: (test as any).id,
    name: (test as any).name,
    status: (test as any).status,
    updatedAt: (test as any).updatedAt,
    type: (test as any).category,
    // Attack results
    asr: (test as any).asr ? parseFloat((test as any).asr) : null,
    accuracy: (test as any).accuracy ? parseFloat((test as any).accuracy) : null,
    recall: (test as any).recall ? parseFloat((test as any).recall) : null,
    precision: (test as any).precision ? parseFloat((test as any).precision) : null,
    f1: (test as any).f1 ? parseFloat((test as any).f1) : null,
    latency: (test as any).latency ? parseFloat((test as any).latency) : null,
    tokenUsage: (test as any).tokenUsage,
    categoryWiseASR: (test as any).categoryWiseASR as Record<string, number> | null,
    // Defense results
    defenseType: (test as any).defenseType,
    defenseASR: (test as any).defenseASR ? parseFloat((test as any).defenseASR) : null,
    defenseAccuracy: (test as any).defenseAccuracy ? parseFloat((test as any).defenseAccuracy) : null,
    defenseRecall: (test as any).defenseRecall ? parseFloat((test as any).defenseRecall) : null,
    defensePrecision: (test as any).defensePrecision ? parseFloat((test as any).defensePrecision) : null,
    defenseF1: (test as any).defenseF1 ? parseFloat((test as any).defenseF1) : null,
    defenseLatency: (test as any).defenseLatency ? parseFloat((test as any).defenseLatency) : null,
    defenseTokenUsage: (test as any).defenseTokenUsage,
    defenseCategoryWiseASR: (test as any).defenseCategoryWiseASR as Record<string, number> | null,
  }

  return <TestComparisonClient test={convertedTest} />
}
