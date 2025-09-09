import { notFound } from "next/navigation"
import { getTestById, getDefenseTestsByParentId } from "@/data-access/tests"
import TestComparisonClient from "./test-comparison-client"

interface TestComparisonPageProps {
  params: Promise<{ id: string }>
}

export default async function TestComparisonPage({ params }: TestComparisonPageProps) {
  const { id } = await params
  
  // Fetch the original test (attack results)
  const originalTest = await getTestById(id)

  if (!originalTest) {
    notFound()
  }

  // Fetch defense tests for this original test
  const defenseTests = await getDefenseTestsByParentId(id)

  // Convert string decimals to numbers and handle null values for original test
  const convertedOriginalTest = {
    ...originalTest,
    id: (originalTest as any).id,
    name: (originalTest as any).name,
    status: (originalTest as any).status,
    updatedAt: (originalTest as any).updatedAt,
    type: (originalTest as any).category,
    asr: (originalTest as any).asr ? parseFloat((originalTest as any).asr) : null,
    accuracy: (originalTest as any).accuracy ? parseFloat((originalTest as any).accuracy) : null,
    recall: (originalTest as any).recall ? parseFloat((originalTest as any).recall) : null,
    precision: (originalTest as any).precision ? parseFloat((originalTest as any).precision) : null,
    f1: (originalTest as any).f1 ? parseFloat((originalTest as any).f1) : null,
    latency: (originalTest as any).latency ? parseFloat((originalTest as any).latency) : null,
    tokenUsage: (originalTest as any).tokenUsage,
    categoryWiseASR: (originalTest as any).categoryWiseASR as Record<string, number> | null,
  }

  // Convert defense tests
  const convertedDefenseTests = defenseTests.map(test => ({
    ...test,
    id: (test as any).id,
    name: (test as any).name,
    status: (test as any).status,
    updatedAt: (test as any).updatedAt,
    type: (test as any).category,
    asr: (test as any).asr ? parseFloat((test as any).asr) : null,
    accuracy: (test as any).accuracy ? parseFloat((test as any).accuracy) : null,
    recall: (test as any).recall ? parseFloat((test as any).recall) : null,
    precision: (test as any).precision ? parseFloat((test as any).precision) : null,
    f1: (test as any).f1 ? parseFloat((test as any).f1) : null,
    latency: (test as any).latency ? parseFloat((test as any).latency) : null,
    tokenUsage: (test as any).tokenUsage,
    categoryWiseASR: (test as any).categoryWiseASR as Record<string, number> | null,
  }))

  return <TestComparisonClient originalTest={convertedOriginalTest} defenseTests={convertedDefenseTests} />
}
