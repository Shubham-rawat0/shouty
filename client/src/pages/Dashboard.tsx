import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useScroll } from "framer-motion";
import { Copy, ExternalLink, ChevronDown, Link2, User } from "lucide-react";
import Navbar from "@/component/Navbar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";


interface UserUrl {
  longUrl: string;
  shortUrl: string;
  timesUsed: number;
  createdAt: string;
}

interface UserResponse {
  authProvider: "google" | "local";
  createdOn: string;
  email: string;
  urlsByUser: UserUrl[];
}

const truncateUrl = (url?: string, max = 60): string => {
  if (typeof url !== "string") return "";
  return url.length > max ? url.slice(0, max) + "…" : url;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getSortedUrls = (
  urls: UserUrl[] | undefined,
  sortType: "timesUsed" | "recent" | "oldest"
): UserUrl[] => {
  if (!urls) return [];
  const sorted = [...urls];

  switch (sortType) {
    case "timesUsed":
      return sorted.sort((a, b) => b.timesUsed - a.timesUsed);
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    default:
      return sorted;
  }
};

const isValidUserUrl = (data: any): data is UserUrl => {
  return (
    typeof data === "object" &&
    typeof data.longUrl === "string" &&
    typeof data.shortUrl === "string" &&
    typeof data.timesUsed === "number" &&
    typeof data.createdAt === "string"
  );
};


function Dashboard() {
  const { scrollYProgress } = useScroll();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [longUrl, setLongUrl] = useState("");
  const [latestUrl, setLatestUrl] = useState<UserUrl | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"timesUsed" | "recent" | "oldest">(
    "recent"
  );

  const serverUrl = import.meta.env.VITE_BACKEND_URL;


  const fetchUser = async () => {
    try {
      const res = await axios.get<UserResponse>(
        `${serverUrl}/user/api/userInfo`,
        { withCredentials: true }
      );
      setUser({
        ...res.data,
        urlsByUser: Array.isArray(res.data.urlsByUser)
          ? res.data.urlsByUser.filter(isValidUserUrl)
          : [],
      });
    } catch {
      window.location.href = "/landing";
    }
  };

  const createUrl = async () => {
    if (!longUrl.trim()) return;

    try {
      new URL(longUrl);
    } catch {
      alert("Please enter a valid URL (include https://)");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/user/url/create`,
        { url: longUrl }, // ✅ correct API
        { withCredentials: true }
      );

      setLatestUrl(res.data);
      setLongUrl("");

      // Refetch user data to sync with server
      await fetchUser();
    } catch (err) {
      console.error("Create URL failed", err);
      alert("Failed to create short URL");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  /* ---------------- Render ---------------- */

  return (
    <>
      <Navbar logged={true} />

      {/* Scroll bar */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 60,
          left: 0,
          right: 0,
          height: 6,
          originX: 0,
          backgroundColor: "#fff312",
          zIndex: 50,
        }}
      />

      <main className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">URL Dashboard</h1>
            <p className="text-slate-500">
              Create concise links that are{" "}
              <span className="font-semibold text-blue-600">easy to share</span>{" "}
              and{" "}
              <span className="font-semibold text-blue-600">
                load instantly
              </span>
            </p>
          </div>

          {/* Create URL */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="text-blue-600" />
              <h2 className="font-semibold text-lg">Create Short URL</h2>
            </div>

            <div className="flex gap-3">
              <Input
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Paste long URL"
                className="h-12"
              />
              <Button
                onClick={createUrl}
                className="h-12 bg-blue-600 hover:bg-blue-700"
              >
                Create
              </Button>
            </div>

            {latestUrl && (
              <div className="bg-green-50 border rounded-lg p-4 flex justify-between items-center">
                <span className="font-medium text-blue-700">
                  {latestUrl.shortUrl}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(latestUrl.shortUrl)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            )}
          </div>

          {/* URLs List */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <span className="font-semibold">
                Your URLs ({user?.urlsByUser?.length ?? 0})
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    Sort:{" "}
                    {sortBy === "timesUsed"
                      ? "Most Used"
                      : sortBy === "recent"
                      ? "Recently Created"
                      : "Oldest"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("timesUsed")}>
                    Most Used
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    Recently Created
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="divide-y">
              {getSortedUrls(user?.urlsByUser, sortBy)?.map((url, i) => (
                <div
                  key={i}
                  className="px-6 py-4 flex justify-between items-center hover:bg-slate-50"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm text-slate-500 truncate max-w-md">
                      {truncateUrl(url.longUrl)}
                    </p>
                    <p className="font-semibold text-blue-600">
                      {url.shortUrl}
                    </p>
                    <p className="text-xs text-slate-400">
                      Created: {formatDate(url.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-bold">{url.timesUsed}</p>
                      <p className="text-xs text-slate-400">Clicks</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Actions <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copy(url.shortUrl)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy short URL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setViewUrl(url.longUrl)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View full URL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(url.shortUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Profile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-8 right-8 rounded-full h-14 w-14"
          >
            <User />
          </Button>
        </SheetTrigger>

        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="text-center">Account overview</SheetTitle>
          </SheetHeader>

          <div className="py-6 px-4 space-y-6">
            <div>
              <p className="text-xs text-slate-400 uppercase">Email</p>
              <p className="font-medium break-all">{user?.email}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">URLs</p>
                <p className="text-2xl font-bold text-[#272323]">
                  {user?.urlsByUser?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Clicks</p>
                <p className="text-2xl font-bold">
                  {user?.urlsByUser?.reduce((a, b) => a + b.timesUsed, 0) ?? 0}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-slate-400 uppercase">Member since</p>
              <p>
                {user?.createdOn &&
                  new Date(user.createdOn).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
              </p>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="secondary"
                className="w-full border-2 border-[#b1b1b1] hover:bg-[#c7c7c7]"
              >
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Full URL Dialog */}
      <Dialog open={!!viewUrl} onOpenChange={() => setViewUrl(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Full URL</DialogTitle>
          </DialogHeader>
          <p className="break-all text-sm bg-slate-50 p-4 rounded border">
            {viewUrl}
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => viewUrl && copy(viewUrl)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={() => viewUrl && window.open(viewUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Dashboard;
