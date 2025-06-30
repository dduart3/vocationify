export function Background () {
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Large, soft, glowing shapes */}
        <div
          className="bg-abstract-shape bg-gradient-to-br from-accent-600 to-tech-600"
          style={{
            width: "600px",
            height: "600px",
            top: "-150px",
            left: "-150px",
            animation:
              "background-float 18s ease-in-out infinite alternate, background-pulse 10s ease-in-out infinite",
          }}
        ></div>
        <div
          className="bg-abstract-shape bg-gradient-to-tl from-neon-500 to-accent-500"
          style={{
            width: "700px",
            height: "700px",
            bottom: "-200px",
            right: "-200px",
            animation:
              "background-float 22s ease-in-out infinite reverse alternate, background-pulse 12s ease-in-out infinite",
          }}
        ></div>
        <div
          className="bg-abstract-shape bg-gradient-to-tr from-tech-500 to-primary-600"
          style={{
            width: "500px",
            height: "500px",
            top: "10%",
            left: "30%",
            animation:
              "background-flow 20s linear infinite alternate, background-pulse 11s ease-in-out infinite",
          }}
        ></div>
        <div
          className="bg-abstract-shape bg-gradient-to-bl from-accent-400 to-neon-400"
          style={{
            width: "400px",
            height: "400px",
            bottom: "5%",
            left: "10%",
            animation:
              "background-flow 25s ease-out infinite reverse, background-pulse 9s ease-in-out infinite",
          }}
        ></div>
      </div>
    )
}