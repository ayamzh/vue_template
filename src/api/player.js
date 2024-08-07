import request from '@/utils/request'

export function getPlayer(name) {
  return request({
    url: '/player/index',
    method: 'post',
    data: { name }
  })
}

export function editPlayer(player) {
  return request({
    url: '/player/edit',
    method: 'post',
    data: player
  })
}

export function deletePlayer(uid) {
  return request({
    url: '/player/delete',
    method: 'post',
    data: { uid }
  })
}

