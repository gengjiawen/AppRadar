import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { useMemo, useState } from "react";
function App() {

  const appIndexingQuery = useQuery({
    queryKey: ["app-indexing"],
    queryFn: async () => {
      const frameworks = await invoke("get_app_frameworks");
      return frameworks as any[];
    },
  });

  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredApps = useMemo(() => {
    if (search) {
      return appIndexingQuery.data?.filter((app) => app.name.toLowerCase().includes(search.toLowerCase()));
    } else {
      return appIndexingQuery.data?.filter((app) => selectedFramework ? app.framework === selectedFramework : true);
    }
  }, [appIndexingQuery.data, selectedFramework, search]);

  function renderFrameworkIcon(framework: string) {
    const height = 32;
    const width = 32;
    switch (framework) {
      case "electron":
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 256 256">
          <g fill="none">
            <rect width={256} height={256} fill="#2b2e3a" rx={60}></rect>
            <path fill="#9feaf9" d="M100.768 70.772c-26.005-4.736-46.567.221-54.762 14.415c-6.115 10.592-4.367 24.635 4.24 39.646a2.67 2.67 0 0 0 4.462.342a2.67 2.67 0 0 0 .519-2.002a2.7 2.7 0 0 0-.355-.993c-7.752-13.522-9.261-25.641-4.247-34.326c6.808-11.791 25.148-16.213 49.187-11.835a2.667 2.667 0 0 0 .956-5.247m-36.999 72.307c10.515 11.555 24.176 22.394 39.756 31.388c37.723 21.78 77.883 27.601 97.675 14.106a2.66 2.66 0 0 0 1.152-1.711a2.66 2.66 0 0 0-1.165-2.756a2.665 2.665 0 0 0-2.992.061c-17.714 12.078-55.862 6.548-92.003-14.318c-15.114-8.726-28.343-19.222-38.478-30.36a2.67 2.67 0 0 0-1.849-.876a2.664 2.664 0 0 0-2.795 2.543a2.67 2.67 0 0 0 .699 1.923"></path>
            <path fill="#9feaf9" d="M194.886 139.835c17.028-20.116 22.973-40.348 14.795-54.512c-6.017-10.423-18.738-15.926-35.645-16.146a2.666 2.666 0 0 0-1.92 4.514a2.67 2.67 0 0 0 1.851.819c15.205.198 26.165 4.939 31.096 13.48c6.792 11.765 1.49 29.807-14.248 48.399a2.66 2.66 0 0 0-.643 1.952c.027.352.124.694.285 1.008a2.65 2.65 0 0 0 1.568 1.328c.337.107.691.146 1.042.114a2.7 2.7 0 0 0 1.005-.296c.313-.164.589-.388.814-.66M151.125 71.66c-15.396 3.299-31.784 9.749-47.522 18.835c-38.942 22.483-64.345 55.636-60.817 79.675a2.66 2.66 0 0 0 1.038 1.775a2.66 2.66 0 0 0 2.98.155a2.66 2.66 0 0 0 1.217-1.657a2.7 2.7 0 0 0 .042-1.048c-3.133-21.344 20.947-52.769 58.207-74.281c15.267-8.815 31.135-15.06 45.972-18.239a2.67 2.67 0 0 0 1.674-4.14a2.68 2.68 0 0 0-1.74-1.106a2.7 2.7 0 0 0-1.051.031"></path>
            <path fill="#9feaf9" d="M88.036 186.835c8.904 24.86 23.469 40.167 39.847 40.167c11.945 0 22.996-8.143 31.614-22.478a2.67 2.67 0 0 0 .327-2.033a2.66 2.66 0 0 0-3.256-1.957a2.68 2.68 0 0 0-1.642 1.242c-7.745 12.883-17.258 19.892-27.043 19.892c-13.605 0-26.596-13.652-34.825-36.63a2.66 2.66 0 0 0-1.364-1.552a2.66 2.66 0 0 0-2.966.432a2.68 2.68 0 0 0-.864 1.877c-.012.355.047.709.173 1.04zm81.322-4.863c4.61-14.728 7.085-31.718 7.085-49.423c0-44.179-15.463-82.263-37.487-92.042a2.667 2.667 0 0 0-2.164 4.874c19.643 8.723 34.317 44.866 34.317 87.168c0 17.177-2.397 33.63-6.84 47.83a2.67 2.67 0 0 0 .816 2.874a2.675 2.675 0 0 0 2.971.313a2.67 2.67 0 0 0 1.303-1.594zm50.224-2.612c0-7.049-5.714-12.763-12.763-12.763s-12.763 5.714-12.763 12.763s5.714 12.763 12.763 12.763s12.763-5.714 12.763-12.763m-5.333 0c0 .976-.192 1.942-.566 2.843a7.42 7.42 0 0 1-4.021 4.022a7.432 7.432 0 0 1-10.273-6.865a7.432 7.432 0 0 1 12.684-5.254a7.43 7.43 0 0 1 2.176 5.254M48.763 192.123c7.05 0 12.764-5.714 12.764-12.763s-5.715-12.763-12.764-12.763S36 172.311 36 179.36s5.715 12.763 12.763 12.763m0-5.333a7.431 7.431 0 0 1-5.254-12.684a7.431 7.431 0 0 1 12.684 5.254a7.43 7.43 0 0 1-7.43 7.43"></path>
            <path fill="#9feaf9" d="M127.883 53.526c7.049 0 12.763-5.714 12.763-12.763S134.932 28 127.883 28s-12.763 5.714-12.763 12.763s5.714 12.763 12.763 12.763m0-5.333a7.43 7.43 0 1 1 0-14.861a7.43 7.43 0 0 1 0 14.861m1.949 93.382c-4.985 1.077-9.896-2.091-10.975-7.076a9.233 9.233 0 0 1 7.076-10.976c4.985-1.077 9.896 2.091 10.976 7.076c1.077 4.985-2.091 9.897-7.077 10.976"></path>
          </g>
        </svg>;
      case "flutter":
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 128 128">
          <path fill="#3fb6d3" d="M12.3 64.2L76.3 0h39.4L32.1 83.6zm64 63.8h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z"></path>
          <path fill="#27aacd" d="m81.6 93.9l-20-20l-19.4 19.6l19.4 19.6z"></path>
          <path fill="#19599a" d="M115.7 128L81.6 93.9l-20 19.2L76.3 128z"></path>
          <linearGradient id="deviconFlutter0" x1={59.365} x2={86.825} y1={116.36} y2={99.399} gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor="#1b4e94"></stop>
            <stop offset={0.63} stopColor="#1a5497"></stop>
            <stop offset={1} stopColor="#195a9b"></stop>
          </linearGradient>
          <path fill="url(#deviconFlutter0)" d="m61.6 113.1l30.8-8.4l-10.8-10.8z"></path>
        </svg>;
      case "qt":
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 128 128">
          <path fill="#41cd52" d="M17.576 17L-.242 34.688v76.226H110.39l17.816-17.687V17H115.86zm29.99 16.426c8.36 0 14.228 2.347 17.555 7.086c3.37 4.69 5.033 11.95 5.033 21.773c0 6.473-.7 11.688-2.054 15.645c-1.403 3.996-3.634 7.039-6.787 9.125l6.83 10.91l-8.364 3.867l-7.222-11.777c-1.05.347-2.715.476-4.99.476c-8.45 0-14.36-2.258-17.686-6.777s-4.99-11.69-4.99-21.426c0-9.777 1.706-17.035 5.076-21.773c3.37-4.74 9.28-7.13 17.6-7.13zm33.926 3.172h8.805v11.691h11.207v7.477H90.297v17.773c0 3.305.258 5.477.74 6.563s1.75 1.609 3.723 1.609l6.652-.262l.397 7.04c-3.634.694-6.393 1.042-8.317 1.042q-6.9 0-9.459-3.129c-1.707-2.086-2.584-6.039-2.584-11.863V55.811h-6.17v-7.522h6.213zm-33.88 4.695c-5.08 0-8.581 1.652-10.51 4.996c-1.88 3.348-2.844 8.65-2.844 15.996c0 7.3.92 12.559 2.758 15.688c1.837 3.129 5.384 4.738 10.595 4.738c5.207 0 8.711-1.566 10.55-4.652c1.796-3.086 2.712-8.344 2.712-15.688c0-7.387-.917-12.734-2.8-16.082c-1.88-3.344-5.342-4.996-10.462-4.996z"></path>
        </svg>;
      case "native":
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 128 128">
          <path fill="#f05138" d="M126.33 34.06a39.3 39.3 0 0 0-.79-7.83a28.8 28.8 0 0 0-2.65-7.58a28.8 28.8 0 0 0-4.76-6.32a23.4 23.4 0 0 0-6.62-4.55a27.3 27.3 0 0 0-7.68-2.53c-2.65-.51-5.56-.51-8.21-.76H30.25a45.5 45.5 0 0 0-6.09.51a21.8 21.8 0 0 0-5.82 1.52c-.53.25-1.32.51-1.85.76a34 34 0 0 0-5 3.28c-.53.51-1.06.76-1.59 1.26a22.4 22.4 0 0 0-4.76 6.32a23.6 23.6 0 0 0-2.65 7.58a79 79 0 0 0-.79 7.83v60.39a39.3 39.3 0 0 0 .79 7.83a28.8 28.8 0 0 0 2.65 7.58a28.8 28.8 0 0 0 4.76 6.32a23.4 23.4 0 0 0 6.62 4.55a27.3 27.3 0 0 0 7.68 2.53c2.65.51 5.56.51 8.21.76h63.22a45 45 0 0 0 8.21-.76a27.3 27.3 0 0 0 7.68-2.53a30 30 0 0 0 6.62-4.55a22.4 22.4 0 0 0 4.76-6.32a23.6 23.6 0 0 0 2.65-7.58a79 79 0 0 0 .79-7.83V34.06z"></path>
          <path fill="#fefefe" d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0 1 13.84 73a50 50 0 0 0 10.85 6.32c15.87 7.1 31.73 6.61 42.9 0c-15.9-11.66-29.4-26.82-39.46-39.2a43.5 43.5 0 0 1-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a272 272 0 0 1-27-32.34a266.8 266.8 0 0 0 44.47 34.87c.71.38 1.26.7 1.7 1a33 33 0 0 0 1.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5"></path>
        </svg>;
      case "tauri":
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 128 128">
          <path fill="#ffc131" d="M86.242 46.547a12.19 12.19 0 0 1-24.379 0c0-6.734 5.457-12.191 12.191-12.191a12.19 12.19 0 0 1 12.188 12.191m0 0"></path>
          <path fill="#24c8db" d="M41.359 81.453a12.19 12.19 0 1 1 24.383 0c0 6.734-5.457 12.191-12.191 12.191S41.36 88.187 41.36 81.453zm0 0"></path>
          <path fill="#ffc131" d="M99.316 85.637a46.5 46.5 0 0 1-16.059 6.535a32.7 32.7 0 0 0 1.797-10.719a33 33 0 0 0-.242-4.02a32.7 32.7 0 0 0 6.996-3.418a32.7 32.7 0 0 0 12.066-14.035a32.71 32.71 0 0 0-21.011-44.934a32.72 32.72 0 0 0-33.91 10.527a33 33 0 0 0-1.48 1.91a54.3 54.3 0 0 0-17.848 5.184A46.54 46.54 0 0 1 60.25 2.094a46.53 46.53 0 0 1 26.34-.375c8.633 2.418 16.387 7.273 22.324 13.984s9.813 15 11.16 23.863a46.54 46.54 0 0 1-20.758 46.071M30.18 41.156l11.41 1.402a32.4 32.4 0 0 1 1.473-6.469a46.4 46.4 0 0 0-12.883 5.066zm0 0"></path>
          <path fill="#24c8db" d="M28.207 42.363a46.5 46.5 0 0 1 16.188-6.559a32.6 32.6 0 0 0-2.004 11.297a33 33 0 0 0 .188 3.512a32.7 32.7 0 0 0-6.859 3.371A32.7 32.7 0 0 0 23.652 68.02c-2.59 5.742-3.461 12.113-2.52 18.34s3.668 12.051 7.844 16.77s9.617 8.129 15.684 9.824s12.496 1.605 18.512-.262a32.7 32.7 0 0 0 15.402-10.266a35 35 0 0 0 1.484-1.918a54.3 54.3 0 0 0 17.855-5.223a46.5 46.5 0 0 1-8.723 16.012a46.5 46.5 0 0 1-21.918 14.609a46.53 46.53 0 0 1-26.34.375a46.6 46.6 0 0 1-22.324-13.984A46.56 46.56 0 0 1 7.453 88.434a46.53 46.53 0 0 1 3.582-26.098a46.53 46.53 0 0 1 17.172-19.973m69.074 44.473c-.059.035-.121.066-.18.102c.059-.035.121-.066.18-.102m0 0"></path>
        </svg>
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 2048 2048">
          <path fill="white" d="M960 4q132 0 254 34t228 96t194 150t149 193t97 229t34 254q0 132-34 254t-96 228t-150 194t-193 149t-229 97t-254 34q-132 0-254-34t-228-96t-194-150t-149-193t-97-229T4 960q0-132 34-254t96-228t150-194t193-149t229-97T960 4m0 1792q115 0 222-30t200-84t169-131t130-169t85-200t30-222q0-115-30-222t-84-200t-131-169t-169-130t-200-85t-222-30q-115 0-222 30t-200 84t-169 131t-130 169t-85 200t-30 222q0 115 30 222t84 200t131 169t169 130t200 85t222 30m-64-388h128v128H896zm64-960q66 0 124 25t101 69t69 102t26 124q0 60-19 104t-47 81t-62 65t-61 59t-48 63t-19 76v64H896v-64q0-60 19-104t47-81t62-65t61-59t48-63t19-76q0-40-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75H640q0-66 25-124t68-101t102-69t125-26"></path>
        </svg>;
    }
  }

  const countByFramework = useMemo(() => {
    return appIndexingQuery.data?.reduce((acc, app) => {
      acc[app.framework] = (acc[app.framework] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [appIndexingQuery.data]);

  return (
    <>
      <main className="overflow-scroll">
        <div className="p-5 pb-0 flex gap-3">
          <Input placeholder="Search by app name" value={search} onChange={(e) => setSearch(e.target.value)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant={"outline"}>
                <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3">
              <DropdownMenuItem key="all" onClick={() => setSelectedFramework(null)}>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 justify-between w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                      <path fill="white" d="M14.116 20q-.667 0-1.141-.475t-.475-1.14v-4.27q0-.666.475-1.14t1.14-.475h4.27q.666 0 1.14.475t.475 1.14v4.27q0 .666-.475 1.14t-1.14.475zm0-8.5q-.667 0-1.141-.475t-.475-1.14v-4.27q0-.666.475-1.14T14.115 4h4.27q.666 0 1.14.475T20 5.615v4.27q0 .666-.475 1.14t-1.14.475zm-8.5 0q-.667 0-1.141-.475T4 9.885v-4.27q0-.666.475-1.14T5.615 4h4.27q.666 0 1.14.475t.475 1.14v4.27q0 .666-.475 1.14t-1.14.475zm0 8.5q-.667 0-1.141-.475T4 18.386v-4.27q0-.666.475-1.14t1.14-.475h4.27q.666 0 1.14.475t.475 1.14v4.27q0 .666-.475 1.14T9.885 20z"></path>
                    </svg>
                    <span>All</span>
                    <span className="ml-auto text-foreground/50">{appIndexingQuery.data?.length || 0}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem key="electron" onClick={() => setSelectedFramework("electron")}>
                <div className="flex items-center gap-2">
                  {renderFrameworkIcon("electron")}
                  <div className="flex flex-1 items-center gap-2 justify-between w-full">
                    <span>Electron</span>
                    <span className="ml-auto text-foreground/50">{countByFramework?.electron || 0}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem key="flutter" onClick={() => setSelectedFramework("flutter")}>
                <div className="flex items-center gap-2">
                  {renderFrameworkIcon("flutter")}
                  <div className="flex flex-1 items-center gap-2 justify-between w-full">
                    <span>Flutter</span>
                    <span className="ml-auto text-foreground/50">{countByFramework?.flutter || 0}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem key="qt" onClick={() => setSelectedFramework("qt")}>
                <div className="flex items-center gap-2">
                  {renderFrameworkIcon("qt")}
                  <div className="flex flex-1 items-center gap-2 justify-between w-full">
                    <span>Qt</span>
                    <span className="ml-auto text-foreground/50">{countByFramework?.qt || 0}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem key="native" onClick={() => setSelectedFramework("native")}>
                <div className="flex items-center gap-2">
                  {renderFrameworkIcon("native")}
                  <div className="flex flex-1 items-center gap-2 justify-between w-full">
                    <span>Native</span>
                    <span className="ml-auto text-foreground/50">{countByFramework?.native || 0}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {filteredApps?.map((app) => (
            <div className="flex p-5 justify-between items-center border rounded-xl" key={app.name}>
              <div className="font-bold text-2xl">{app.name}</div>
              <div className="">{renderFrameworkIcon(app.framework)}</div>
            </div>
          ))}
        </div>
      </main>
    </>

  );
}

export default App;
