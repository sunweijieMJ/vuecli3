<template>
  <keep-alive :include="'IdeaList, TopicList'">
    <router-view/>
  </keep-alive>
</template>

