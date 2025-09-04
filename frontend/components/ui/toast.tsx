"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', title, description, action, onClose, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'success':
          return 'border-success/50 bg-success/10 text-success'
        case 'error':
          return 'border-destructive/50 bg-destructive/10 text-destructive'
        case 'warning':
          return 'border-warning/50 bg-warning/10 text-warning'
        case 'info':
          return 'border-info/50 bg-info/10 text-info'
        default:
          return 'border-border bg-card text-card-foreground'
      }
    }

    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-5 w-5" />
        case 'error':
          return <AlertCircle className="h-5 w-5" />
        case 'warning':
          return <AlertTriangle className="h-5 w-5" />
        case 'info':
          return <Info className="h-5 w-5" />
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 shadow-lg transition-all duration-300",
          "animate-in slide-in-from-top-full",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 space-y-1">
            {title && (
              <div className="font-semibold text-sm">{title}</div>
            )}
            {description && (
              <div className="text-sm opacity-90">{description}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {action}
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-md p-1 hover:bg-black/10 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }