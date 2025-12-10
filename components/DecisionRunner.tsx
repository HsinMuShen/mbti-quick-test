'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import decisionTree from '@/data/decision_tree.json'
import ProgressBar from './ProgressBar'
import { Button } from './ui/button'
import { ArrowLeft, RotateCcw } from 'lucide-react'

interface DecisionTree {
  start: string
  nodes: Record<
    string,
    | {
        question: Record<string, string>
        options: Array<{ label: Record<string, string>; next: string }>
      }
    | {
        result: {
          mbti: string
          title: Record<string, string>
          summary: Record<string, string>
        }
      }
  >
}

const tree = decisionTree as DecisionTree

function calculateTotalSteps(nodeId: string, visited: Set<string> = new Set()): number {
  if (visited.has(nodeId)) return 0
  visited.add(nodeId)

  const node = tree.nodes[nodeId]
  if (!node) return 0

  if ('result' in node) return 1

  if ('options' in node) {
    let maxDepth = 0
    for (const option of node.options) {
      const depth = calculateTotalSteps(option.next, new Set(visited))
      maxDepth = Math.max(maxDepth, depth)
    }
    return 1 + maxDepth
  }

  return 0
}

export default function DecisionRunner({ locale }: { locale: string }) {
  const t = useTranslations('test')
  const router = useRouter()
  const [currentNodeId, setCurrentNodeId] = useState(tree.start)
  const [history, setHistory] = useState<string[]>([])
  const [totalSteps, setTotalSteps] = useState(0)

  useEffect(() => {
    const total = calculateTotalSteps(tree.start)
    setTotalSteps(total)
  }, [])

  const currentNode = tree.nodes[currentNodeId]
  const isResult = currentNode && 'result' in currentNode

  useEffect(() => {
    if (isResult && 'result' in currentNode) {
      const mbti = currentNode.result.mbti.toLowerCase()
      router.push(`/${locale}/result/${mbti}`)
    }
  }, [isResult, currentNode, locale, router])

  const handleAnswer = useCallback(
    (nextNodeId: string) => {
      setHistory((prev) => [...prev, currentNodeId])
      setCurrentNodeId(nextNodeId)
    },
    [currentNodeId]
  )

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const previousNodeId = history[history.length - 1]
      setHistory((prev) => prev.slice(0, -1))
      setCurrentNodeId(previousNodeId)
    }
  }, [history])

  const handleRestart = useCallback(() => {
    setCurrentNodeId(tree.start)
    setHistory([])
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isResult) return

      if (e.key === 'ArrowLeft' && history.length > 0) {
        handleBack()
      } else if (e.key === 'Enter' && 'options' in currentNode && currentNode.options.length > 0) {
        handleAnswer(currentNode.options[0].next)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentNode, history, handleBack, handleAnswer, isResult])

  if (isResult) {
    return null
  }

  if (!currentNode || !('question' in currentNode)) {
    return <div>Error: Invalid node</div>
  }

  const question = currentNode.question[locale] || currentNode.question.en
  const options = currentNode.options

  const currentStep = history.length + 1

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {history.length > 0 && (
            <Button variant="outline" onClick={handleBack} aria-label={t('back')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
          )}
          <Button variant="ghost" onClick={handleRestart} aria-label={t('restart')}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('restart')}
          </Button>
        </div>
      </div>

      <ProgressBar current={currentStep} total={totalSteps} />

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{question}</h2>

        <div className="space-y-4">
          {options.map((option, index) => {
            const label = option.label[locale] || option.label.en
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option.next)}
                className="w-full text-left px-6 py-4 bg-blue-600 hover:bg-blue-700 border-2 border-blue-700 hover:border-blue-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium text-white shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                aria-label={label}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

