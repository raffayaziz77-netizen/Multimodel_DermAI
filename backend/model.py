# model.py

import torch
import torch.nn as nn
from torchvision import models

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

class MultiModalNet(nn.Module):
    def __init__(self, num_classes, context_dim=39):
        super().__init__()

        self.cnn = models.resnet18(weights=None)
        self.cnn.fc = nn.Identity()

        self.ctx_net = nn.Sequential(
            nn.Linear(context_dim, 128),
            nn.LayerNorm(128),
            nn.ReLU()
        )

        self.classifier = nn.Sequential(
            nn.Linear(512 + 128, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, img, ctx):
        img_feat = self.cnn(img)
        ctx_feat = self.ctx_net(ctx)
        return self.classifier(torch.cat([img_feat, ctx_feat], dim=1))


def load_model(path):
    checkpoint = torch.load(path, map_location=DEVICE)

    model = MultiModalNet(
        num_classes=len(checkpoint["class_to_id"]),
        context_dim=checkpoint["context_dim"]
    )

    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(DEVICE)
    model.eval()

    return model, checkpoint["id_to_class"]
