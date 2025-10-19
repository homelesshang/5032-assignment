<template>
  <div>
    <!-- ✅ 顶部导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid px-5">
        <a class="navbar-brand fw-bold fs-4 text-white" href="#">🏋️ Community Gym</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/client">🏠 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/classes">📋 Classes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5 active" to="/customer-map">🧭 Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/rating">⭐ Rate Coach</router-link>
            </li>
          </ul>

          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ✅ 地图部分 -->
    <div class="map-page">
      <h2 class="title mt-4">Find Gyms Near You</h2>

      <!-- 按钮区 -->
      <div class="btn-group mb-3">
        <button class="btn btn-primary" @click="showMyLocation" :disabled="!isMapReady">
          📍 Show My Location
        </button>
        <button class="btn btn-success" @click="loadCommunityGyms" :disabled="!isMapReady">
          🏋️ Load Community Gyms
        </button>
      </div>

      <div id="map"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, collection, getDocs } from "firebase/firestore"

const router = useRouter()
const db = getFirestore()

const map = ref(null)
const userMarker = ref(null)
const gymMarkers = ref([])
const isMapReady = ref(false)

/* ✅ 异步加载 Google Maps (旧版稳定版，无 marker 库) */
async function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log("✅ Google Maps 已存在，跳过加载")
      return resolve()
    }

    const script = document.createElement("script")
    // 👇 使用 v=3.54 (最后一个不强制 Map ID 的版本)
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAZnIG0rn9CeOBGomjZCI5zK_tESvr1oEk&v=3.54&callback=initMap"
    script.async = true

    window.initMap = () => {
      console.log("✅ Google Maps 脚本加载完成 (v3.54)")
      resolve()
    }

    script.onerror = (err) => {
      console.error("❌ Google Maps 加载失败:", err)
      reject(err)
    }

    document.head.appendChild(script)
  })
}

/* ✅ 初始化地图 */
onMounted(async () => {
  try {
    await loadGoogleMaps()
    map.value = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -37.913, lng: 145.13 },
      zoom: 14,
      mapId: undefined, // 禁用新版地图ID依赖
    })
    isMapReady.value = true
    console.log("✅ Map initialized.")
  } catch (err) {
    alert("❌ Failed to load Google Maps. Please check API key or network.")
  }
})

/* 📍 显示用户位置 */
async function showMyLocation() {
  if (!isMapReady.value || !map.value)
    return alert("⚠️ Map still loading. Please wait.")
  if (!navigator.geolocation)
    return alert("❌ Geolocation not supported by this browser.")

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }

      // 删除旧标记
      if (userMarker.value) userMarker.value.setMap(null)

      userMarker.value = new google.maps.Marker({
        position: userPos,
        map: map.value,
        title: "You are here",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white",
        },
      })

      map.value.setCenter(userPos)
      console.log("📍 User located:", userPos)
    },
    (err) => {
      console.error("Geolocation error:", err)
      alert("⚠️ Unable to access your location.")
    }
  )
}

/* 🏋️ 从 Firestore 加载健身房 */
async function loadCommunityGyms() {
  if (!isMapReady.value || !map.value)
    return alert("⚠️ Map not ready yet.")

  // 清空旧标记
  gymMarkers.value.forEach((m) => m.setMap(null))
  gymMarkers.value = []

  try {
    const snapshot = await getDocs(collection(db, "gyms"))
    if (snapshot.empty) {
      alert("❌ No gyms found in Firestore.")
      return
    }

    snapshot.forEach((doc) => {
      const gym = doc.data()
      if (gym.lat && gym.lng) {
        const marker = new google.maps.Marker({
          map: map.value,
          position: { lat: gym.lat, lng: gym.lng },
          title: gym.name,
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${gym.name}</strong><br>${gym.address || ""}`,
        })
        marker.addListener("click", () => infoWindow.open(map.value, marker))
        gymMarkers.value.push(marker)
      }
    })

    alert("✅ Community Gyms loaded successfully!")
  } catch (err) {
    console.error("🔥 Firestore error:", err)
    alert("Failed to load gyms from Firestore.")
  }
}

/* 🚪 登出功能 */
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
.map-page {
  text-align: center;
}

.title {
  margin-bottom: 10px;
}

.btn-group button {
  margin: 0 8px;
  font-size: 16px;
  border-radius: 8px;
}

#map {
  width: 100%;
  height: 550px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ✅ 导航栏样式 */
.navbar-nav .nav-link {
  transition: color 0.2s, background-color 0.2s;
  border-radius: 10px;
}
.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}
.navbar {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.5px;
}
</style>