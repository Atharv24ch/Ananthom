import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET() {
  return NextResponse.json(products);
}
