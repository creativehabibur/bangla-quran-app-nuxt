<template>
    <header class="fixed left-0 top-0 w-full bg-white z-10 border-b shadow-xl">
      <div class="mx-auto container px-6">
        <div class="relative flex items-center justify-between">
  
          <div class="relative py-3 flex justify-start items-center">
            <img alt="Quran logo" class="logo" src="@/assets/images/quran.png" width="50" />
            <span class="ml-3 text-lg font-bold">Quran App</span>
          </div>
  
          <nav class="flex space-x-0 sm:space-x-4">
            <NuxtLink to="/" class="text-gray-700 px-2 py-2 text-lg font-bold">Home</NuxtLink>
            <NuxtLink to="/about" class="text-gray-700 px-2 py-2 text-lg font-bold">About</NuxtLink>
          </nav>
  
        </div>
      </div>
    </header>
    <div class="gap h-16"></div>
</template>