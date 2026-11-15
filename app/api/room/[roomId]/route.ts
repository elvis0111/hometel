import { canManage } from "@/lib/admin";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

/** Returns an error response, or null when the user may manage the room. */
const checkRoomAccess = async (roomId: string, userId: string | null) => {
  if (!roomId) {
    return new NextResponse("Room Id is required", { status: 400 });
  }

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const room = await prismadb.room.findUnique({
    where: { id: roomId },
    select: { Hotel: { select: { userId: true } } },
  });

  if (!room) {
    return new NextResponse("Room not found", { status: 404 });
  }

  if (!room.Hotel || !canManage(room.Hotel.userId, userId)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return null;
};

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    const denied = await checkRoomAccess(params.roomId, userId);
    if (denied) return denied;

    // A room cannot be moved to another hotel.
    const { id, hotelId, ...data } = body;

    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data,
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room/roomId PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = auth();

    const denied = await checkRoomAccess(params.roomId, userId);
    if (denied) return denied;

    const room = await prismadb.room.delete({
      where: {
        id: params.roomId,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room/roomId DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
