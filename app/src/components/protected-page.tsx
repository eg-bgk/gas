import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex w-full flex-col items-center gap-10">
        <Image src="/logo.jpg" alt="World.fun" width={100} height={100} />
        <div className="flex flex-col gap-4">
          <h1 className="text-center font-heading text-3xl font-bold">Welcome to World.fun!</h1>
          <p className="max-w-sm text-center text-xl text-muted-foreground">
            World.fun where every human can create and launch a token in a few clicks.
          </p>
        </div>

        <div className="mt-auto w-full">
          <Button
            className="h-16 w-full gap-5 text-xl tracking-wide"
            onClick={() => signIn("worldcoin")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-background"
              viewBox="0 0 600.10632 600.10632"
              preserveAspectRatio="xMidYMid"
              version="1.1"
              id="svg11"
            >
              <defs id="defs1">
                <clipPath id="__lottie_element_2">
                  <rect width="800" height="800" x="0" y="0" id="rect1" />
                </clipPath>
                <clipPath id="__lottie_element_4">
                  <path d="M 0,0 H 1728 V 1728 H 0 Z" id="path1" />
                </clipPath>
              </defs>
              <g
                clipPath="url(#__lottie_element_2)"
                id="g11"
                transform="translate(-99.689875,-99.947068)"
              >
                <g
                  clipPath="url(#__lottie_element_4)"
                  transform="matrix(1.2367001,0,0,1.2367001,-668.2998,-668.50879)"
                  opacity="1"
                  id="g10"
                >
                  <g
                    transform="matrix(1.2994699,0,0,1.2994699,725.31494,727.89368)"
                    opacity="1"
                    id="g3"
                  >
                    <g opacity="1" transform="translate(131.17999,104.74)" id="g2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                        fillOpacity="0"
                        strokeMiterlimit="10"
                        stroke="currentColor"
                        strokeOpacity="1"
                        strokeWidth="35px"
                        d="m 119.067,-87.470001 c 0,0 -145.507001,0.230003 -145.507001,0.230003 C -74.620003,-87.239998 -113.68,-48.18 -113.68,0 c 0,48.18 39.059997,87.239998 87.239999,87.239998 0,0 140.120001,0 140.120001,0"
                        id="path2"
                      />
                    </g>
                  </g>
                  <g
                    transform="matrix(1.2994699,0,0,1.2994699,643.73987,841.25928)"
                    opacity="1"
                    id="g5"
                  >
                    <g opacity="1" id="g4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                        fillOpacity="0"
                        strokeMiterlimit="10"
                        stroke="currentColor"
                        strokeOpacity="1"
                        strokeWidth="35px"
                        d="m 2.309,17.5 c 0,0 336.11101,0 336.11101,0"
                        id="path3"
                      />
                    </g>
                  </g>
                  <g
                    transform="matrix(1.2994699,0,0,1.2994699,620.99915,621.3761)"
                    opacity="1"
                    id="g7"
                  >
                    <g opacity="1" transform="translate(186.71001,186.71001)" id="g6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                        fillOpacity="0"
                        strokeMiterlimit="10"
                        stroke="currentColor"
                        strokeOpacity="1"
                        strokeWidth="35px"
                        d="M 0,-169.21001 C 93.452003,-169.21001 169.21001,-93.452003 169.21001,0 169.21001,93.452003 93.452003,169.21001 0,169.21001 -93.452003,169.21001 -169.21001,93.452003 -169.21001,0 -169.21001,-93.452003 -93.452003,-169.21001 0,-169.21001 Z"
                        id="path5"
                      />
                    </g>
                  </g>
                  <g
                    transform="matrix(1.2994699,0,0,1.2994699,621.49915,621.3761)"
                    opacity="1"
                    id="g9"
                  >
                    <g opacity="1" transform="translate(186.71001,186.71001)" id="g8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                        fillOpacity="0"
                        strokeMiterlimit="10"
                        stroke="currentColor"
                        strokeOpacity="1"
                        strokeWidth="35px"
                        d="M 0,0"
                        id="path7"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            Sign In with World ID
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
