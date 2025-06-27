import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Info, AlertCircle } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  position: string;
  statement: string;
  photoUrl: string;
  department?: string;
}

interface VotePortalProps {
  hasVoted?: boolean;
  candidates?: Candidate[];
  onVote?: (candidateId: string) => void;
}

const VotePortal: React.FC<VotePortalProps> = ({
  hasVoted = false,
  candidates = [
    {
      id: "1",
      name: "Jane Smith",
      position: "President",
      statement:
        "I promise to improve campus facilities and create more opportunities for student engagement.",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      department: "Computer Science",
    },
    {
      id: "2",
      name: "John Doe",
      position: "Vice President",
      statement:
        "My goal is to represent student interests and advocate for better academic resources.",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      department: "Business Administration",
    },
    {
      id: "3",
      name: "Alex Johnson",
      position: "Secretary",
      statement:
        "I will ensure transparent communication between students and administration.",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      department: "Political Science",
    },
    {
      id: "4",
      name: "Maria Garcia",
      position: "Treasurer",
      statement:
        "I will manage our budget efficiently and allocate funds to benefit all students.",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      department: "Economics",
    },
  ],
  onVote = () => {},
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null,
  );
  const [voteSubmitted, setVoteSubmitted] = useState<boolean>(hasVoted);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCandidateSelect = (candidateId: string) => {
    if (voteSubmitted) return;
    setSelectedCandidate(candidateId);
  };

  const handleVoteSubmit = () => {
    if (selectedCandidate) {
      onVote(selectedCandidate);
      setVoteSubmitted(true);
      setIsDialogOpen(false);
    }
  };

  return (
    <motion.div
      className="w-full p-6 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vote Portal</h1>
          <p className="text-gray-600 mt-1">
            Cast your vote for the upcoming election
          </p>
        </div>

        {voteSubmitted && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5 text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            Vote Submitted
          </Badge>
        )}
      </div>

      {voteSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">
              Vote Successfully Cast
            </h3>
            <p className="text-green-700 text-sm mt-1">
              Thank you for participating in the election. Your vote has been
              recorded.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Voting Instructions</h3>
            <p className="text-blue-700 text-sm mt-1">
              Select a candidate by clicking on their card, then click the "Cast
              Vote" button to submit your choice. Your vote is final and cannot
              be changed.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedCandidate === candidate.id ? "ring-2 ring-primary ring-offset-2" : ""} ${voteSubmitted ? "opacity-80 pointer-events-none" : ""}`}
            onClick={() => handleCandidateSelect(candidate.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-gray-100">
                    <AvatarImage
                      src={candidate.photoUrl}
                      alt={candidate.name}
                    />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {candidate.department}
                    </CardDescription>
                  </div>
                </div>
                <Badge>{candidate.position}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{candidate.statement}</p>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <div className="w-full flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  ID: {candidate.id}
                </span>
                {selectedCandidate === candidate.id && !voteSubmitted && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Selected
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              disabled={!selectedCandidate || voteSubmitted}
              className="px-8 py-6 text-base font-medium"
            >
              Cast Vote
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to vote for{" "}
                {candidates.find((c) => c.id === selectedCandidate)?.name} for
                the position of{" "}
                {candidates.find((c) => c.id === selectedCandidate)?.position}.
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-amber-800 text-sm">
                    This action cannot be undone. Your vote is final once
                    submitted.
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVoteSubmit}>
                Confirm Vote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default VotePortal;
