import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import {
  FormControl,
  FormMessage,
  FormItem,
  FormField,
} from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { SendIcon } from "lucide-react";

import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import Comment from "../comment/Comment";
import { zodResolver } from "@hookform/resolvers/zod";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

export default function OpenedPost() {
  const [comments, setComments] = useState<string[]>([]);

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleAddComment: SubmitHandler<FieldValues> = (data) => {
    if (data.comment) {
      setComments((prevComments) => [...prevComments, data.comment]);
    }
  };

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] w-full py-8 gap-y-2 flex flex-col">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-semibold mb-2">Hei hei</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Mulle meeldis see äge koht
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full gap-x-2">
              <Button variant="outline" className="">
                Back
              </Button>
            </div>
          </CardFooter>
        </Card>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddComment)}>
              <div className="flex gap-x-2">
                <FormField
                  control={control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Write your comment"
                          {...field}
                        />
                      </FormControl>
                      {errors.comment && <FormMessage>{}</FormMessage>}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit
                  <SendIcon />
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="flex flex-col gap-y-2 h-[40vh] overflow-y-scroll">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Comment name={"Martin"} comment={comment} key={index} />
            ))
          ) : (
            <div className="p-2 text-slate-500 italic">No comments</div>
          )}
          <div ref={endOfCommentsRef} />
        </div>
      </div>
    </div>
  );
}
