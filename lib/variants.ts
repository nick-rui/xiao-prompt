// Simple variant utility to replace class-variance-authority
import { cn } from "@/lib/utils"

type VariantConfig = {
  variants: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}

export function createVariants(baseClasses: string, config: VariantConfig) {
  return (props: Record<string, string | undefined> = {}) => {
    let classes = baseClasses

    // Apply default variants first
    const variants = { ...config.defaultVariants, ...props }

    // Apply each variant
    Object.entries(variants).forEach(([key, value]) => {
      if (value && config.variants[key] && config.variants[key][value]) {
        classes = cn(classes, config.variants[key][value])
      }
    })

    return classes
  }
}

export type VariantProps<T extends (...args: any) => any> = {
  [K in keyof Parameters<T>[0]]?: Parameters<T>[0][K]
}
