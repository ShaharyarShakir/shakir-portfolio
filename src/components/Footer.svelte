<script lang="ts">
</script>

<footer class="relative flex justify-between items-center mx-7 mt-16 py-6">
  <div
    class="top-0 left-0 absolute bg-linear-to-r from-gray-100 via-gray-500 to-gray-100 w-full h-px"
  ></div>

  <span class="flex items-center gap-1.5 text-gray-400 text-sm">
    Built with
    <span
      aria-label="love"
      class="inline-block text-red-400 animate-[heartbeat_1.4s_ease_infinite]"
    >
      ♥
    </span>
    by Shaharyar Shakir
  </span>

  <div class="flex items-center gap-5">
    <a
      href="https://github.com/ShaharyarShakir"
      target="_blank"
      rel="noopener"
      aria-label="GitHub"
      class="img-text"
    >
      <svg
        width="18"
        height="18"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>GitHub</title>
        <path
          fill="currentColor"
          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        />
      </svg>
    </a>

    <a
      href="https://linkedin.com/in/shaharyar-shakir-3674a027b"
      target="_blank"
      rel="noopener"
      aria-label="LinkedIn"
      class="img-text"
    >
      <svg
        width="18"
        height="18"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z"
          fill="currentColor"
        />
        <path
          d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z"
          fill="#0F0F0F"
        />
        <path
          d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z"
          fill="#0F0F0F"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
          fill="#0F0F0F"
        />
      </svg>
    </a>

    <a
      href="https://twitter.com"
      target="_blank"
      rel="noopener"
      aria-label="Twitter / X"
      class="img-text"
    >
      <svg
        width="18"
        height="18"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>X</title>
        <path
          fill="currentColor"
          d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
        />
      </svg>
    </a>
  </div>
</footer>

<style>
  @import "tailwindcss";
  .img-text {
    @apply flex items-center text-gray-400 hover:text-black transition-all hover:-translate-y-0.5 duration-200;
  }
  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    14% {
      transform: scale(1.25);
    }
    28% {
      transform: scale(1);
    }
    42% {
      transform: scale(1.15);
    }
    56% {
      transform: scale(1);
    }
  }
</style>
