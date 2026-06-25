export type BuyRequest = {
  productId: number
  quantity: number
}

export type BuyResponse = {
  productId: number
  quantity: number
  executedPrice: number
  totalAmount: number
  tradedAt: string
}

export type TransferItem = {
  fromAccountId: number
  amount: number
}

export type TransferRequest = {
  transfers: TransferItem[]
}

export type TransferResponse = {
  brokerageBalance: number
  transferredAt: string
}
