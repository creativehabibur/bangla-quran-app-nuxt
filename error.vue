<template>
    <Head>
        <Title>Error {{ error.statusCode }}  - Quran app</Title>
    </Head>

    <Header />

    <div class="container mx-auto px-6 py-8">
        <div class="flex items-center justify-center flex-col text-gray-500 text-center">
            <h1 class="text-8xl font-bold text-center mb-6">{{ error.statusCode }}</h1>
            <h2 class="text-2xl font-bold text-center">Opps! sorry</h2>
            <p class="text-xl mb-6">{{ error.message }}</p>
            <p class="text-lg max-w-md mb-8">Sorry to see you here. Either you don't have access to this page or the requested resource not found or an error has occurred from our end.</p>
            <button @click="handleError" class="btn">Go back to Homepage</button>
        </div>
    </div>

    <Footer />

</template>

<script setup>
    defineProps(['error']);

    function handleError(){
        clearError({
            redirect: '/'
        })
    }
</script>