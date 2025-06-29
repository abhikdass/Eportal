import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { CheckCircle, Info, AlertCircle, Calendar, Clock, Vote, Loader2 } from "lucide-react";

interface Candidate {
  _id: string;
  name: string;
  position: string;
  StudentId: string;
  email: string;
  statement?: string;
  phone?: string;
  department?: string;
  status?: 'approved' | 'pending' | 'rejected';
  electionId?: {
    _id: string;
    title: string;
    post: string;
  };
}

interface Election {
  _id: string;
  title: string;
  description: string;
  post: string;
  type: string;
  nominationStartDate: string;
  nominationEndDate: string;
  campaignStartDate: string;
  campaignEndDate: string;
  votingDate: string;
  resultAnnouncementDate: string;
  active: boolean;
}

interface VoteStatus {
  hasVoted: boolean;
  voteId?: string;
  candidate?: {
    name: string;
    position: string;
  };
  votedAt?: string;
}

interface VotePortalProps {
  onVoteSuccess?: () => void;
}

const VotePortal: React.FC<VotePortalProps> = ({ onVoteSuccess }) => {
  // State management
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  
  // Loading states
  const [isLoadingElection, setIsLoadingElection] = useState<boolean>(true);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState<boolean>(false);
  const [isLoadingVoteStatus, setIsLoadingVoteStatus] = useState<boolean>(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState<boolean>(false);

  useEffect(() => {
    fetchActiveElection();
  }, []);

  useEffect(() => {
    if (activeElection) {
      fetchCandidates();
      fetchVoteStatus();
    }
  }, [activeElection]);

  // Fetch active election
  const fetchActiveElection = async () => {
    try {
      setIsLoadingElection(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/active`);
      
      if (response.ok) {
        const data = await response.json();
        setActiveElection(data);
      } else if (response.status === 404) {
        setAlert({ type: "warning", message: "No active election found" });
      } else {
        throw new Error("Failed to fetch active election");
      }
    } catch (error) {
      console.error("Error fetching active election:", error);
      setAlert({ type: "error", message: "Failed to load active election" });
    } finally {
      setIsLoadingElection(false);
    }
  };

  // Fetch candidates for the active election
  const fetchCandidates = async () => {
    if (!activeElection) return;
    
    try {
      setIsLoadingCandidates(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/candidates/${activeElection._id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Candidates API response:", data); // Debug log
        
        // Handle the response structure: { electionId, candidates: [...] }
        const candidatesData = data.candidates || data;
        
        // Ensure it's an array
        const candidatesArray = Array.isArray(candidatesData) ? candidatesData : [];
        
        // Filter only approved candidates for voting (if status field exists)
        const approvedCandidates = candidatesArray.filter((candidate: Candidate) => 
          !candidate.status || candidate.status === 'approved'
        );
        
        console.log("Processed candidates:", approvedCandidates); // Debug log
        setCandidates(approvedCandidates);
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to fetch candidates: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setAlert({ type: "error", message: "Failed to load candidates" });
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  // Check if user has already voted
  const fetchVoteStatus = async () => {
    if (!activeElection) return;
    
    try {
      setIsLoadingVoteStatus(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ type: "error", message: "Please log in to vote" });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/status/${activeElection._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVoteStatus(data);
      } else {
        throw new Error("Failed to fetch vote status");
      }
    } catch (error) {
      console.error("Error fetching vote status:", error);
      setAlert({ type: "error", message: "Failed to check vote status" });
    } finally {
      setIsLoadingVoteStatus(false);
    }
  };

  // Cast vote
  const handleVoteSubmit = async () => {
    if (!selectedCandidate || !activeElection) return;

    try {
      setIsSubmittingVote(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ type: "error", message: "Please log in to vote" });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/cast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          candidateId: selectedCandidate,
          electionId: activeElection._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: "success", message: "Vote cast successfully!" });
        
        // Update vote status
        await fetchVoteStatus();
        
        // Call parent callback if provided
        if (onVoteSuccess) {
          onVoteSuccess();
        }
        
        setIsDialogOpen(false);
        setSelectedCandidate(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cast vote");
      }
    } catch (error: any) {
      console.error("Error casting vote:", error);
      setAlert({ type: "error", message: error.message || "Failed to cast vote" });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleCandidateSelect = (candidateId: string) => {
    if (voteStatus?.hasVoted) return;
    setSelectedCandidate(candidateId);
  };

  // Check if voting is currently allowed
  const isVotingAllowed = () => {
    if (!activeElection) return false;
    const now = new Date();
    const votingDate = new Date(activeElection.votingDate);
    const campaignEnd = new Date(activeElection.campaignEndDate);
    
    // Allow voting on voting day or after campaign ends
    return now.toDateString() === votingDate.toDateString() || now >= campaignEnd;
  };

  // Auto-hide alerts
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <motion.div
      className="w-full p-6 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vote Portal</h1>
          <p className="text-gray-600 mt-1">
            {activeElection ? activeElection.title : "Loading election..."}
          </p>
        </div>

        {voteStatus?.hasVoted && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5 text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            Vote Submitted
          </Badge>
        )}
      </div>

      {/* Alert Messages */}
      {alert && (
        <Alert className={`mb-6 ${
          alert.type === "error" ? "border-red-200 bg-red-50" :
          alert.type === "warning" ? "border-amber-200 bg-amber-50" :
          "border-green-200 bg-green-50"
        }`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoadingElection ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading election details...</span>
        </div>
      ) : !activeElection ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-amber-800 mb-2">No Active Election</h3>
          <p className="text-amber-700">There are no active elections available for voting at this time.</p>
        </div>
      ) : (
        <>
          {/* Election Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Election Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Position</h4>
                  <p className="text-lg">{activeElection.post}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Type</h4>
                  <p className="text-lg">{activeElection.type}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Voting Date</h4>
                  <p className="text-lg">{new Date(activeElection.votingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Results Date</h4>
                  <p className="text-lg">{new Date(activeElection.resultAnnouncementDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vote Status */}
          {voteStatus?.hasVoted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Vote Successfully Cast</h3>
                <p className="text-green-700 text-sm mt-1">
                  Thank you for participating in the election. You voted for{" "}
                  <strong>{voteStatus.candidate?.name}</strong> for the position of{" "}
                  <strong>{voteStatus.candidate?.position}</strong>.
                </p>
                <p className="text-green-600 text-xs mt-1">
                  Voted on: {voteStatus.votedAt ? new Date(voteStatus.votedAt).toLocaleString() : "Unknown"}
                </p>
              </div>
            </div>
          ) : !isVotingAllowed() ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
              <Clock className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Voting Not Yet Available</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Voting will be available on {new Date(activeElection.votingDate).toLocaleDateString()}.
                  Please check back during the voting period.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Voting Instructions</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Select a candidate by clicking on their card, then click the "Cast Vote" button to submit your choice. 
                  Your vote is final and cannot be changed.
                </p>
              </div>
            </div>
          )}

          {/* Candidates */}
          {isLoadingCandidates ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading candidates...</span>
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Candidates Available</h3>
              <p className="text-gray-600">There are no approved candidates for this election yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate._id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCandidate === candidate._id ? "ring-2 ring-primary ring-offset-2" : ""
                    } ${
                      voteStatus?.hasVoted || !isVotingAllowed() ? "opacity-80 pointer-events-none" : ""
                    }`}
                    onClick={() => handleCandidateSelect(candidate._id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-gray-100">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                              alt={candidate.name}
                            />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {candidate.department || "N/A"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge>{candidate.position}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {candidate.statement ? (
                        <p className="text-gray-600 text-sm">{candidate.statement}</p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No campaign statement provided</p>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Student ID: {candidate.StudentId}</p>
                        <p>Email: {candidate.email}</p>
                        {candidate.phone && <p>Phone: {candidate.phone}</p>}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          ID: {candidate._id.slice(-8)}
                        </span>
                        {selectedCandidate === candidate._id && !voteStatus?.hasVoted && isVotingAllowed() && (
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

              {/* Vote Button */}
              <div className="flex justify-center">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      disabled={!selectedCandidate || voteStatus?.hasVoted || !isVotingAllowed() || isSubmittingVote}
                      className="px-8 py-6 text-base font-medium"
                    >
                      {isSubmittingVote ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Vote...
                        </>
                      ) : (
                        "Cast Vote"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to vote for{" "}
                        <strong>{candidates.find((c) => c._id === selectedCandidate)?.name}</strong> for
                        the position of{" "}
                        <strong>{candidates.find((c) => c._id === selectedCandidate)?.position}</strong>.
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-amber-800 text-sm">
                            This action cannot be undone. Your vote is final once submitted.
                          </span>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isSubmittingVote}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleVoteSubmit} disabled={isSubmittingVote}>
                        {isSubmittingVote ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Confirm Vote"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default VotePortal;
