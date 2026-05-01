<script>
  export let size = 28;
  export let color = 'currentColor';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 64 64"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M14 18 L32 11 L50 18 L50 39 C50 46 42 53 32 56 C22 53 14 46 14 39 Z"
    fill={color}
    stroke={color}
    stroke-width="2"
    stroke-linejoin="round"
  />
  <path
    d="M24 28 L32 24 L40 28 L40 38 L32 42 L24 38 Z"
    fill="var(--color-bg, #FAFAF7)"
  />
  <circle cx="32" cy="33" r="3.2" fill={color} />
</svg>
