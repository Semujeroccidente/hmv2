import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAdminError } from '@/lib/auth-utils';

// GET - Obtener un reporte específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Reporte no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar reporte existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    const updates = await request.json();

    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      message: 'Reporte actualizado exitosamente',
      report: updatedReport
    });
  } catch (error: any) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar reporte
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    await prisma.report.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Reporte eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}