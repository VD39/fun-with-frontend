<template>
  <div id="app" :class="$style.wrapper">
    <header>
      <h1 :class="[$style.title, $style.center]">
        The <span class="bold">Latest</span> xkcd Comics
      </h1>
    </header>
    <main>
      <div v-if="loading">
        <div :class="$style.loaderWrapper" role="alert" aria-busy="true">
          <div :class="$style.loader"><div></div></div>
          <p>Loading...</p>
        </div>
      </div>
      <div v-else-if="hasError">
        <p
          :class="$style.center"
          role="contentinfo"
          aria-label="Warning message"
        >
          Sorry something went wrong!
        </p>
      </div>
      <div v-else>
        <div v-if="comics" :class="$style.comics">
          <Comic
            :class="$style.comic"
            v-for="comic in comics"
            :key="comic.num"
            :comic="comic"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Comic from '@/components/Comic.vue';

// Import the reset and global css files.
import '@/assets/css/reset.css';
import '@/assets/css/global.css';

export default {
  name: 'app',
  components: {
    Comic,
  },
  data: () => ({
    comics: [],
    loading: true,
    hasError: false,
  }),
  async created() {
    await this.getComics();
    this.loading = false;
  },
  methods: {
    /**
     * Gets the first comic as the response gives information about the latest single
     * comic. Using the number ID, we can see what the last number is and the
     * previous 9 comics.
     */
    async getComics() {
      await fetch('/info.0.json')
        .then(response => response.json())
        .then(async data => {
          this.comics.push(data);
          const currentNumber = data.num - 1; // minus one as array index starts from 0.

          // Get the last 9 comics using the current num from the first comic
          // response. We can create an array of fetch response to pass to the
          // Promise.all.
          const urls = Array.from(Array(9).keys())
            .map(index => `/${currentNumber - index}/info.0.json`)
            .map(url =>
              fetch(url)
                .then(response => response.json())
                .then(data => Promise.resolve(data))
                .catch(error => Promise.reject(new Error(error))),
            );

          await Promise.all(urls)
            .then(data => {
              this.comics = [...this.comics, ...data]; // Merge the two arrays.
            })
            .catch(error => this.errorMessage(error, false));
        })
        .catch(error => this.errorMessage(error));
    },
    /**
     * Will show the error for any response in the console. The optional parameter
     * is if the error happens on the first request. In the Promise.all if any fail they
     * will fail silently and the ones fetched will still be displayed.
     * @param {String} // The error of the response.
     * @param {string} [hasError=true] // If the hasError message should be displayed.
     */
    errorMessage(error, hasError = true) {
      // eslint-disable-next-line no-console
      console.warn(
        `Sorry something went wrong! The request failed because: ${error}`,
      );

      this.hasError = hasError;
    },
  },
};
</script>

<style module>
.wrapper {
  width: 1000px;
  margin: auto;
}

.center {
  text-align: center;
}

.title {
  margin-top: 30px;
}

.comics {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
}

.comic {
  flex-basis: 30%;
  margin-bottom: 30px;
}

.loaderWrapper {
  display: block;
  margin: auto;
  width: 80px;
  text-align: center;
}

.loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.loader div {
  position: absolute;
  border: 4px solid purple;
  opacity: 1;
  border-radius: 50%;
  animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.loader div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
