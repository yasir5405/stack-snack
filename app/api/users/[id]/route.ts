import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const user = await User.findById(id);

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// GET /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ status: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// GET /api/users/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    const body = await req.json();
    const validatedData = UserSchema.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!updatedUser) throw new NotFoundError("User");

    return NextResponse.json(
      { status: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
