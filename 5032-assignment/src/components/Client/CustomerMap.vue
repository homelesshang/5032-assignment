<template>
  <div class="map-page">
    <h2 class="title">Find Gyms Near You</h2>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"

onMounted(() => {
  // ✅ 防止重复加载
  if (!window.google) {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAZnIG0rn9CeOBGomjZCI5zK_tESvr1oEk&libraries=places&callback=initMap`
    script.async = true
    document.head.appendChild(script)
  } else {
    window.initMap()
  }

  // ✅ 初始化函数
  window.initMap = () => {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 14,
    })

    // ✅ 获取用户定位
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          // 标记用户位置
          new google.maps.Marker({
            position: userLocation,
            map,
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

          map.setCenter(userLocation)

          // 搜索附近健身房
          const service = new google.maps.places.PlacesService(map)
          const request = {
            location: userLocation,
            radius: 2000,
            type: ["gym"],
          }

          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              results.forEach((place) => {
                if (!place.geometry?.location) return

                const marker = new google.maps.Marker({
                  map,
                  position: place.geometry.location,
                  title: place.name,
                })

                const infoWindow = new google.maps.InfoWindow({
                  content: `<strong>${place.name}</strong><br>${place.vicinity}`,
                })

                marker.addListener("click", () => {
                  infoWindow.open(map, marker)
                })
              })
            } else {
              console.warn("Places search failed:", status)
            }
          })
        },
        () => {
          alert("Unable to access your location. Please allow location access.")
        }
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }
})
</script>

<style scoped>
.map-page {
  text-align: center;
  margin-top: 20px;
}
.title {
  margin-bottom: 10px;
}
#map {
  width: 100%;
  height: 550px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>