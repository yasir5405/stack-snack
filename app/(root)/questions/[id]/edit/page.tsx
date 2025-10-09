import { authOptions } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/route";
import { getQuestion } from "@/lib/actions/question.action";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await getServerSession(authOptions);
  if (!session) return redirect(ROUTES.SIGN_IN);

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success) return notFound();

  if (question?.author.toString() !== session.user.id) {
    redirect(ROUTES.QUESTION(id));
  }
  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
