import requests
from dataclasses import dataclass


@dataclass
class Artist:
    name: str
    genre: str
    monthly_listeners: int

    @property
    def is_popular(self):
        return self.monthly_listeners > 1_000_000


def fetch_lineup(festival_url: str) -> list[Artist]:
    response = requests.get(festival_url)
    response.raise_for_status()

    return [
        Artist(
            name=item["name"],
            genre=item["genre"],
            monthly_listeners=item["monthly_listeners"],
        )
        for item in response.json()["artists"]
    ]


def filter_by_genre(artists: list[Artist], genre: str) -> list[Artist]:
    return [a for a in artists if a.genre.lower() == genre.lower()]


if __name__ == "__main__":
    artists = fetch_lineup("https://api.example.com/lineup")
    hidden_gems = [a for a in artists if not a.is_popular]

    for artist in sorted(hidden_gems, key=lambda a: a.name):
        print(f"{artist.name} - {artist.genre}")
